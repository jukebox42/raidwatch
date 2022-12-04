import {
  AllDestinyManifestComponents,
  DestinyActivityDefinition,
  DestinyActivityModifierDefinition,
  DestinyClass,
  DestinyColor,
  DestinyItemType,
  DestinyProfileResponse,
  DestinyPublicMilestone,
  DestinyPublicMilestoneChallengeActivity,
} from "bungie-api-ts/destiny2";

import { getEquipment, filterEquipmentBySubclass, filterEquipmentByItemType } from "./items";
import { AppArmorType, AppSubclassType, AppWeaponType } from "./itemTypes";
import { AppStatType, filterOutLightStat, findLightStat, getStats } from "./stats";
import { analyze, AnalyzeData, ImportantSockets } from "./analyze";

export type { AppStatType } from "./stats";
export type { AppArmorType, AppSubclassType, AppWeaponType } from "./itemTypes";
export type { AppSocketType } from "./sockets";

export type AppCharacterType = {
  membershipId: string,
  characterId: string,
  emblem: {
    path: string,
    bgPath: string,
    color: DestinyColor,
  },
  classType: DestinyClass,
  lightStat: AppStatType,
  stats: AppStatType[],
  subclass: AppSubclassType,
  weapons: AppWeaponType[],
  armors: AppArmorType[],
  importantSockets: ImportantSockets,
  analyzeData: AnalyzeData,
}

export type AppActivity = {
  activity: DestinyPublicMilestoneChallengeActivity,
  definition: DestinyActivityDefinition,
  modifiers: DestinyActivityModifierDefinition[],
}

type GetDataType = (
  profile: DestinyProfileResponse,
  characterId: string,
  manifest: AllDestinyManifestComponents) => AppCharacterType | undefined;

export const getData: GetDataType = (profile, characterId, manifest) => {
  if (!profile?.characters?.data || !profile.characters.data[characterId] || !profile.profile.data?.userInfo) {
    return; // TODO
  }
  const characterData = profile.characters.data[characterId];
  const equipment = getEquipment(profile, characterId, manifest);

  const stats = getStats(profile, characterId, manifest);
  const lightStat = findLightStat(stats);
  const restStats = filterOutLightStat(stats);
  const subclass = filterEquipmentBySubclass(equipment) as AppSubclassType;
  const weapons = filterEquipmentByItemType(DestinyItemType.Weapon, equipment) as AppWeaponType[];
  const armors = filterEquipmentByItemType(DestinyItemType.Armor, equipment) as AppArmorType[];
  const breakerDefinitions = manifest.DestinyBreakerTypeDefinition;

  const { importantSockets, analyzeData } = analyze(armors, weapons, subclass, breakerDefinitions);
  
  return {
    membershipId: profile.profile.data.userInfo.membershipId,
    characterId: characterId,
    emblem: {
      path: characterData.emblemPath,
      bgPath: characterData.emblemBackgroundPath,
      color: characterData.emblemColor,
    },
    classType: characterData.classType,
    lightStat,
    stats: restStats,
    subclass,
    weapons,
    armors,
    importantSockets,
    analyzeData,
  };
}

// TODO: make these hashes
const importantModifiers = [
  "Shielded Foes",
  "Champion Foes",
  "Acute Arc Burn",
  "Acute Solar Burn",
  "Acute Void Burn",
  "Acute Stasis Burn",
  "Enfilade",
];

export const getActivitiesData = (activities: DestinyPublicMilestone[], manifest: AllDestinyManifestComponents) => {
  const activitiesList = activities
    .filter(a => !!a.activities)
    .flatMap(a => a.activities)
    .filter(a => !!a.modifierHashes)
    .map(activity => ({
      activity,
      definition: manifest.DestinyActivityDefinition[activity.activityHash],
      modifiers: activity.modifierHashes
        .map(m => manifest.DestinyActivityModifierDefinition[m])
        .filter(m => importantModifiers.includes(m.displayProperties.name)),
    }))
    // TODO: this could likely be filtered better. I'm trying to remove the encounters that dont have champions
    .filter(a => a.modifiers.length > 0);

  return [
    ...activitiesList.filter(
      (a, i) => activitiesList.findIndex(
        b => b.activity.activityHash.toString() === a.activity.activityHash.toString()) === i)
  ];
}
