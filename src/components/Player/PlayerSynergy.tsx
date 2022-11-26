import { CheckIcon, ChevronDownIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Heading, useStyleConfig, HStack, Grid, GridItem, Flex, IconButton, Spacer, useBoolean } from "@chakra-ui/react";
import { AllDestinyManifestComponents, DamageType, DestinyDamageTypeDefinition, DestinyEnergyType, DestinyEnergyTypeDefinition } from "bungie-api-ts/destiny2";

import { Sockets } from "components/Player/Character/equipment";
import { energyTypeToDamageType } from "core/analyze/helpers";
import { AppBreakerType } from "core/itemTypes";
import { useStore } from "hooks/useStore";
import Energies from "./Character/partials/Energies";

const PlayerSynergy = () => {
  const styles = useStyleConfig("Player", { variant: "ally" });
  const charStatStyles = useStyleConfig("Flex", { variant: "charstats" });
  const [isExpanded, setIsExpanded] = useBoolean(true);
  const players = useStore(state => state.players);
  const manifest = useStore(state => state.manifest);

  const wellTypes: DestinyEnergyType[] = [];
  const damageTypes: DamageType[] = [];
  let friendlyCharge = false;

  // TODO: This is the only place in the display layer we're using the manifest...
  // Get Damage Definitions
  const importantDamageEnums = [
    DamageType.Arc,
    DamageType.Thermal,
    DamageType.Void,
    DamageType.Stasis,
  ];
  const damageDefinitions = (manifest as AllDestinyManifestComponents).DestinyDamageTypeDefinition;
  const damageDefinitionsArray: DestinyDamageTypeDefinition[] = Object.keys(damageDefinitions)
    .map(e => damageDefinitions[e])
    .filter(e => importantDamageEnums.includes(e.enumValue));

  // Get Breaker Definitions
  const breakerDefinitions = (manifest as AllDestinyManifestComponents).DestinyBreakerTypeDefinition;
  const breakerDefinitionsArray: AppBreakerType[] = Object.keys(breakerDefinitions)
    .map(b => ({ hash: b, definition: breakerDefinitions[b], sourceNames: [] }));

  // Get energy Definitions
  const importantEnergyEnums = [
    DestinyEnergyType.Arc,
    DestinyEnergyType.Thermal,
    DestinyEnergyType.Void,
    DestinyEnergyType.Stasis,
  ];
  const energyDefinitions = (manifest as AllDestinyManifestComponents).DestinyEnergyTypeDefinition;
  const energyDefinitionsArray: DestinyEnergyTypeDefinition[] = Object.keys(energyDefinitions)
    .map(e => energyDefinitions[e])
    .filter(e => importantEnergyEnums.includes(e.enumValue));

  // Iterate over players for synergy
  players.forEach(player => {
    if (!player.characterData) {
      return;
    }
    const data = player.characterData;

    // Friendly Charge with Light
    if (data.analyzeData.canChargeFriends) {
      friendlyCharge = true;
    }

    // Breakers
    breakerDefinitionsArray.forEach(breaker => {
      const foundBreaker = data.analyzeData.championBreakers.find(b => b.hash === breaker.hash);
      if (foundBreaker) {
        breaker.sourceNames.push(...foundBreaker.sourceNames);
      }
    });

    // Well Types
    wellTypes.push(...data.analyzeData.wellTypesGenerated);

    // Damage elements (including subclass)
    damageTypes.push(
      ...data.analyzeData.weaponDamageTypes,
      energyTypeToDamageType(data.analyzeData.subclassEnergyType)
    );
  });

  // console.log("PlayerSynergy", breakers, wellTypes, damageTypes);

  return (
    <Box __css={styles}>
      <Flex direction="row" gap="1" __css={charStatStyles}>
        <Heading size="md">Player Synergy</Heading>
        <Spacer />
        <IconButton
          aria-label="Expand"
          size="sm"
          icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={setIsExpanded.toggle}
        />
      </Flex>
      {isExpanded && <Grid templateColumns="repeat(2, 1fr)" gap={6} m={1}>
        <GridItem>
          <Heading size="sm" mb={1}>Damage Types</Heading>
          <Energies
            energyDefinitions={damageDefinitionsArray.sort((a, b) => a.enumValue < b.enumValue ? -1 : 1)}
            energyEnumValues={damageTypes}
          />
        </GridItem>
        <GridItem>
          <Heading size="sm" mb={1}>Breaker Types</Heading>
          <HStack>
            <Sockets sockets={[]} breakers={breakerDefinitionsArray} />
          </HStack>
        </GridItem>
      </Grid>}
      {isExpanded && <Grid templateColumns="repeat(2, 1fr)" gap={6} m={1}>
        <GridItem>
          <Heading size="sm" mb={1}>Well Types</Heading>
          <HStack>
          <Energies
            energyDefinitions={energyDefinitionsArray.sort((a, b) => a.enumValue < b.enumValue ? -1 : 1)}
            energyEnumValues={wellTypes}
          />
          </HStack>
        </GridItem>
        <GridItem>
          <Heading size="sm" mb={1}>Friendly Charge</Heading>
          <HStack>
            {friendlyCharge ? <CheckIcon w="26px" /> : <CloseIcon w="26px" h="26px" />}
          </HStack>
        </GridItem>
      </Grid>}
    </Box>
  );
}

export default PlayerSynergy;
