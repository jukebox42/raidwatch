import { ChangeEvent, useEffect, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  useStyleConfig,
  HStack,
  Grid,
  GridItem,
  Flex,
  IconButton,
  Spacer,
  Select,
  Text,
  Divider,
  Collapse
} from "@chakra-ui/react";
import {
  AllDestinyManifestComponents,
  DamageType,
  DestinyDamageTypeDefinition,
} from "bungie-api-ts/destiny2";

import { Breakers } from "components/Player/Character/equipment";
import { AppBreakerType } from "core/itemTypes";
import { useStore } from "hooks/useStore";
import Energies from "./Character/partials/Energies";
import Modifiers from "./Character/partials/Modifiers";
import { AppActivity } from "core";

const PlayerSynergy = () => {
  const styles = useStyleConfig("Player", { variant: "ally" });
  const charStatStyles = useStyleConfig("Flex", { variant: "charstats" });
  const {
    // keys
    manifest, players, activities, settings, isCollapsed, selectedActivity,
    // functions
    loadActivities, toggleIsCollapsed, setSelectedActivity
  } = useStore(state => ({
    manifest: state.manifest,
    players: state.players,
    activities: state.activities,
    selectedActivity: state.selectedActivity,
    settings: state.settings,
    isCollapsed: state.isCollapsed,
    loadActivities: state.loadActivities,
    toggleIsCollapsed: state.toggleIsCollapsed,
    setSelectedActivity: state.setSelectedActivity,
  }));
  const [damageTypes, setDamageTypes] = useState<DamageType[]>([]);
  const [breakers, setBreakers] = useState<AppBreakerType[]>([]);

  // TODO: This is the only place in the display layer we're using the manifest...
  // Get Damage Definitions
  const importantDamageEnums = [
    DamageType.Arc,
    DamageType.Thermal,
    DamageType.Void,
    DamageType.Stasis,
    DamageType.Strand,
  ];
  const damageDefinitions = (manifest as AllDestinyManifestComponents).DestinyDamageTypeDefinition;
  const damageDefinitionsArray: DestinyDamageTypeDefinition[] =
    Object.values(damageDefinitions).filter(e => importantDamageEnums.includes(e.enumValue));

  useEffect(() => {
    loadActivities();
  }, [loadActivities, manifest]);

  useEffect(() => {
    const processedDamageTypes: DamageType[] = [];
    // Get Breaker Definitions
    const breakerDefinitions = (manifest as AllDestinyManifestComponents).DestinyBreakerTypeDefinition;
    const breakerDefinitionsArray: AppBreakerType[] =
      Object.values(breakerDefinitions).map(b => ({ hash: b.hash.toString(), definition: b, sourceNames: [] }));

    // Iterate over players for synergy
    players.forEach(player => {
      if (!player.characterData) {
        return;
      }
      const data = player.characterData;

      // Breakers
      breakerDefinitionsArray.forEach(breaker => {
        const foundBreaker = data.analyzeData.championBreakers.find(b => b.hash === breaker.hash);
        if (foundBreaker) {
          breaker.sourceNames.push(...foundBreaker.sourceNames);
        }
      });

      // Damage Types (including subclass)
      processedDamageTypes.push(...data.analyzeData.weaponDamageTypes, data.analyzeData.subclassDamageType);
    });
    setDamageTypes(processedDamageTypes);
    setBreakers(breakerDefinitionsArray);
  }, [players, manifest]);

  const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedActivity(event.target.value);
  }

  let activity: AppActivity | undefined;
  if (selectedActivity) {
    activity = activities.find(a => a.activity.activityHash.toString() === selectedActivity) as AppActivity;
    console.log("Selected Activity", activity);
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
          icon={!isCollapsed ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={toggleIsCollapsed}
        />
      </Flex>
      <Collapse in={!isCollapsed} animateOpacity>
        {!settings.hideSynergyActivity && <Box p={1}>
          <Select placeholder="Select an Activity" onChange={onSelect} value={selectedActivity} disabled={!activities.length}>
            {activities.map(a => (
              <option
                key={a.activity.activityHash.toString()}
                value={a.activity.activityHash.toString()}
              >{a.definition.displayProperties.name}</option>
            ))}
          </Select>
          {activity && <Text color="gray.400" mt={1}>{activity.definition.displayProperties.description}</Text>}
          {activity?.modifiers && <Modifiers definitions={activity.modifiers} />}
        </Box>}
        <Divider mt={1} />
      </Collapse>
      <Grid templateColumns="repeat(2, 1fr)" gap={6} m={1}>
        <GridItem>
          <Heading size="sm" mb={1}>Damage Types</Heading>
          <Energies
            energyDefinitions={damageDefinitionsArray.sort((a, b) => a.enumValue < b.enumValue ? -1 : 1)}
            energyEnumValues={damageTypes}
            requiredEnumValues={!settings.hideSynergyActivity && activity ? activity.surgeTypes : []}
          />
        </GridItem>
        <GridItem>
          <Heading size="sm" mb={1}>Breaker Types</Heading>
          <HStack>
            <Breakers
              breakers={breakers}
              requiredBreakerEnumValues={!settings.hideSynergyActivity && activity ? activity.breakerTypes : []}
            />
          </HStack>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default PlayerSynergy;
