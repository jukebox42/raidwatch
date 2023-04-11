import {
  AllDestinyManifestComponents,
  DamageType,
  DestinyActivityDefinition,
  DestinyActivityModifierDefinition,
  DestinyBreakerType,
  DestinyCharacterProgressionComponent,
  DestinyClass,
  DestinyColor,
  DestinyItemType,
  DestinyProfileResponse,
  DestinyPublicMilestone,
  DestinyPublicMilestoneChallengeActivity,
} from "bungie-api-ts/destiny2";

import { getEquipment, filterEquipmentBySubclass, filterEquipmentByItemType } from "./items";
import { AppArmorType, AppSubclassType, AppWeaponType, AppArtifactType } from "./itemTypes";
import { AppStatType, filterOutLightStat, findLightStat, getStats } from "./stats";
import { analyze, AnalyzeData, ImportantSockets } from "./analyze";

export type { AppStatType } from "./stats";
export type { AppArmorType, AppSubclassType, AppWeaponType, AppArtifactType } from "./itemTypes";
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
  artifactPerks: AppArtifactType[],
  analyzeData: AnalyzeData,
}

export type AppActivity = {
  activity: DestinyPublicMilestoneChallengeActivity,
  definition: DestinyActivityDefinition,
  modifiers: DestinyActivityModifierDefinition[],
  surgeTypes: DamageType[],
  breakerTypes: DestinyBreakerType[],
}

type GetDataType = (
  profile: DestinyProfileResponse,
  characterId: string,
  manifest: AllDestinyManifestComponents) => AppCharacterType | undefined;

export const getData: GetDataType = (profile, characterId, manifest) => {
  if (!profile?.characters?.data || !profile.characters.data[characterId] || !profile.profile.data?.userInfo) {
    return;
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
  let artifactPerks: AppArtifactType[] = [];
  if (profile.characterProgressions.data && profile.characterProgressions.data[characterId]) {
    artifactPerks = getArtifactPerks(profile.characterProgressions.data[characterId], manifest);
  }

  const { importantSockets, analyzeData } = analyze(armors, weapons, subclass, artifactPerks, breakerDefinitions);
  
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
    artifactPerks,
    analyzeData,
  };
}

export const getArtifactPerks = (
  characterProgression: DestinyCharacterProgressionComponent, manifest: AllDestinyManifestComponents
): AppArtifactType[] => {
  return characterProgression.seasonalArtifact.tiers
    .flatMap(p => p.items)
    .map(item => {
      const definition = manifest.DestinyInventoryItemDefinition[item.itemHash];
      const perkDefinitions = definition.perks
        .map(p => manifest.DestinySandboxPerkDefinition[p.perkHash])
        .filter(p => p.isDisplayable);
      return {
        item,
        definition,
        perkDefinitions,
      }
    })
    // Filter down to only what the player has active
    .filter(p => p.item.isActive);
}

// https://archive.destiny.report/version/e0c36174-e416-4093-8bb4-ca4c35cd37bd/DestinyActivityModifierDefinition
const importantModifiers = [
  // Surge
  { name: "Solar Surge", hash: 426976067, damageTypes: [DamageType.Thermal,] },
  { name: "Arc Surge", hash: 2691200658, damageTypes: [DamageType.Arc] },
  { name: "Void Surge", hash: 3196075844, damageTypes: [DamageType.Void] },
  { name: "Stasis Surge", hash: 3809788899, damageTypes: [DamageType.Stasis] },
  { name: "Strand Surge", hash: 3810297122, damageTypes: [DamageType.Strand] },
  // Champion Foes
  { name: "Champion Foes", hash: 2006149364, breakerTypes: [DestinyBreakerType.ShieldPiercing, DestinyBreakerType.Disruption, DestinyBreakerType.Stagger] },
  { name: "Champion Foes", hash: 1990363418, breakerTypes: [DestinyBreakerType.ShieldPiercing, DestinyBreakerType.Disruption] },
  { name: "Champion Foes", hash: 438106166, breakerTypes: [DestinyBreakerType.ShieldPiercing, DestinyBreakerType.Stagger] },
  { name: "Champion Foes", hash: 3307318061, breakerTypes: [DestinyBreakerType.Stagger, DestinyBreakerType.Disruption] },
  { name: "Champion Foes", hash: 2475764450, breakerTypes: [DestinyBreakerType.Stagger] },
  { name: "Champions: Overload", hash: 1201462052, breakerTypes: [DestinyBreakerType.Disruption] },
  { name: "Champions: Barrier", hash: 1974619026, breakerTypes: [DestinyBreakerType.ShieldPiercing] },
];

export const getActivitiesData = (activities: DestinyPublicMilestone[], manifest: AllDestinyManifestComponents) => {
  const activitiesList = activities
    .filter(a => !!a.activities)
    .flatMap(a => a.activities)
    .filter(a => !!a.modifierHashes)
    .map(activity => {
      const modifiers = importantModifiers.filter(m => activity.modifierHashes.find(hash => m.hash === hash));
      const surgeTypes = modifiers.filter(m => m.damageTypes).flatMap(m => m.damageTypes as DamageType[]);
      const breakerTypes = modifiers.filter(m => m.breakerTypes).flatMap(m => m.breakerTypes as DestinyBreakerType[]);
      return {
        activity,
        definition: manifest.DestinyActivityDefinition[activity.activityHash],
        modifiers: activity.modifierHashes.map(m => manifest.DestinyActivityModifierDefinition[m]),
        surgeTypes,
        breakerTypes,
      };
    })
    .filter(a => a.surgeTypes.length > 0 || a.breakerTypes.length > 0);

  return [
    ...activitiesList.filter(
      (a, i) => activitiesList.findIndex(
        b => b.activity.activityHash.toString() === a.activity.activityHash.toString()) === i)
  ];
}
