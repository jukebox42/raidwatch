import { ChangeEvent, useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Heading, useStyleConfig, HStack, Grid, GridItem, Flex, IconButton, Spacer, useBoolean, Select } from "@chakra-ui/react";
import { AllDestinyManifestComponents, DamageType, DestinyDamageTypeDefinition, DestinyEnergyType, DestinyEnergyTypeDefinition} from "bungie-api-ts/destiny2";

import { Sockets } from "components/Player/Character/equipment";
import { energyTypeToDamageType } from "core/analyze/helpers";
import { AppBreakerType } from "core/itemTypes";
import { useStore } from "hooks/useStore";
import Energies from "./Character/partials/Energies";
import { AppActivity } from "store/activityStore";
import Modifiers from "./Character/partials/Modifiers";

const PlayerSynergy = () => {
  const styles = useStyleConfig("Player", { variant: "ally" });
  const charStatStyles = useStyleConfig("Flex", { variant: "charstats" });
  const [isExpanded, setIsExpanded] = useBoolean(true);
  const players = useStore(state => state.players);
  const manifest = useStore(state => state.manifest);
  const activities = useStore(state =>  state.activities);
  const loadActivities = useStore(store => store.loadActivities);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [wellTypes, setWellTypes] = useState<DestinyEnergyType[]>([]);
  const [damageTypes, setDamageTypes] = useState<DamageType[]>([]);
  const [friendlyCharge, setFriendlyCharge] = useState(false);

  // TODO: This is the only place in the display layer we're using the manifest...
  // Get Damage Definitions
  const importantDamageEnums = [
    DamageType.Arc,
    DamageType.Thermal,
    DamageType.Void,
    DamageType.Stasis,
  ];
  const damageDefinitions = (manifest as AllDestinyManifestComponents).DestinyDamageTypeDefinition;
  const damageDefinitionsArray: DestinyDamageTypeDefinition[] =
    Object.values(damageDefinitions).filter(e => importantDamageEnums.includes(e.enumValue));

  // Get Breaker Definitions
  const breakerDefinitions = (manifest as AllDestinyManifestComponents).DestinyBreakerTypeDefinition;
  const breakerDefinitionsArray: AppBreakerType[] =
    Object.values(breakerDefinitions).map(b => ({ hash: b.hash.toString(), definition: b, sourceNames: [] }));

  // Get energy Definitions
  const importantEnergyEnums = [
    DestinyEnergyType.Arc,
    DestinyEnergyType.Thermal,
    DestinyEnergyType.Void,
    DestinyEnergyType.Stasis,
  ];
  const energyDefinitions = (manifest as AllDestinyManifestComponents).DestinyEnergyTypeDefinition;
  const energyDefinitionsArray: DestinyEnergyTypeDefinition[] =
    Object.values(energyDefinitions).filter(e => importantEnergyEnums.includes(e.enumValue));

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    const processedWellTypes: DestinyEnergyType[] = [];
    const processedDamageTypes: DamageType[] = []
    // Iterate over players for synergy
    players.forEach(player => {
      if (!player.characterData) {
        return;
      }
      const data = player.characterData;

      // Friendly Charge with Light
      if (data.analyzeData.canChargeFriends) {
        setFriendlyCharge(true);
      }

      // Breakers
      breakerDefinitionsArray.forEach(breaker => {
        const foundBreaker = data.analyzeData.championBreakers.find(b => b.hash === breaker.hash);
        if (foundBreaker) {
          breaker.sourceNames.push(...foundBreaker.sourceNames);
        }
      });

      // Well Types
      processedWellTypes.push(...data.analyzeData.wellTypesGenerated);

      // Damage elements (including subclass)
      processedDamageTypes.push(
        ...data.analyzeData.weaponDamageTypes,
        energyTypeToDamageType(data.analyzeData.subclassEnergyType)
      );
    });
    setWellTypes(processedWellTypes);
    setDamageTypes(processedDamageTypes);
  }, [players])

  const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedActivityId(event.target.value);
  }

  let modifiers = [];
  if (selectedActivityId) {
    const activity = activities.find(a => a.activity.activityHash.toString() === selectedActivityId) as AppActivity;
    modifiers.push(...activity.modifiers);
  }

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
      <Box p={1}>
        <Select placeholder="Select an Activity" onChange={onSelect} value={selectedActivityId} disabled={!activities.length}>
          {activities.map(a => (
            <option
              key={a.activity.activityHash.toString()}
              value={a.activity.activityHash.toString()}
            >{a.definition.displayProperties.name}</option>
          ))}
        </Select>
        {modifiers && <Modifiers definitions={modifiers} />}
      </Box>
    </Box>
  );
}

export default PlayerSynergy;
