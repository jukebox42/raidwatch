import {
  AllDestinyManifestComponents,
  DestinyClass,
  DestinyColor,
  DestinyItemType,
  DestinyProfileResponse,
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
