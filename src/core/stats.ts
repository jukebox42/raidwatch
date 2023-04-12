import { AllDestinyManifestComponents, DestinyProfileResponse, DestinyStatDefinition } from "bungie-api-ts/destiny2";
import { diffHashes } from "utils/common";

/**
 * This is the hash of the light stat. Used to pull it out of the list.
 */
 export const LIGHT_STAT_HASH = "1935470627";

export type AppStatType = {
  value: number,
  definition: DestinyStatDefinition,
}

type GetStatsType = (
  profile: DestinyProfileResponse,
  characterId: string,
  manifest: AllDestinyManifestComponents,
) => AppStatType[];

export const getStats: GetStatsType = (profile, characterId, manifest) => {
  if (!profile?.characters?.data  || !profile.characters.data[characterId]) {
    console.log("getEquipment No Equipment");
    return [];
  }
  const stats = profile.characters.data[characterId].stats;
  
  return Object.keys(stats).map(s => ({
    value: stats[s],
    definition: manifest.DestinyStatDefinition[s]
  }));
}

export const findLightStat = (stats: AppStatType[]): AppStatType => {
  return stats.find(s => diffHashes(s.definition.hash, LIGHT_STAT_HASH)) as AppStatType;
}

export const filterOutLightStat = (stats: AppStatType[]): AppStatType[] => {
  return stats.filter(s => !diffHashes(s.definition.hash, LIGHT_STAT_HASH));
}
