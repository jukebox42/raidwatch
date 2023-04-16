import {
  AllDestinyManifestComponents,
  DestinyEnergyTypeDefinition,
  DestinyInventoryItemDefinition,
  DestinySandboxPerkDefinition,
  DestinyStatDefinition
} from "bungie-api-ts/destiny2";
import { filterManifestData } from "utils/common";

export const getItemDefinitions = (keys: string[], manifest: AllDestinyManifestComponents) => {
  const definitions = filterManifestData<DestinyInventoryItemDefinition>(
    manifest.DestinyInventoryItemDefinition,
    keys
  );

  return definitions;
}

export const getPerkDefinitions = (keys: string[], manifest: AllDestinyManifestComponents) => {
  const definitions = filterManifestData<DestinySandboxPerkDefinition>(
    manifest.DestinySandboxPerkDefinition,
    keys
  );

  return definitions.filter((p, i) => 
    p.isDisplayable && definitions.findIndex(
      pi => pi.displayProperties.description === p.displayProperties.description
    ) === i);
}

/**
 * This functions job is to find the elemental overlay to specific mods. It's the color on top of mods.
 */
export const getEnergyCostDefinition = (key: string | undefined, manifest: AllDestinyManifestComponents) => {
  if (key === undefined) {
    return undefined;
  }
  const energyTypeDefinitions = filterManifestData<DestinyEnergyTypeDefinition>(
    manifest.DestinyEnergyTypeDefinition,
    [key]
  );
  if (!energyTypeDefinitions.length) {
    return undefined;
  }
  const energyCostDefinitions = filterManifestData<DestinyStatDefinition>(
    manifest.DestinyStatDefinition,
    [energyTypeDefinitions[0].costStatHash.toString()]
  );
  if (!energyCostDefinitions.length) {
    return;
  }
  return energyCostDefinitions[0];
}
