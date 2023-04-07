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
  shieldTypes: DamageType[],
  breakerTypes: DestinyBreakerType[],
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

// TODO: make these hashes
// https://archive.destiny.report/version/e0c36174-e416-4093-8bb4-ca4c35cd37bd/DestinyActivityModifierDefinition
const importantModifiers = [
  // Shielded Foes
  { name: "Shielded Foes", hash: 1651706850, damageTypes: [DamageType.Arc, DamageType.Thermal, DamageType.Void] },
  { name: "Shielded Foes", hash: 2833087500, damageTypes: [DamageType.Arc, DamageType.Void] },
  { name: "Shielded Foes", hash: 3230561446, damageTypes: [DamageType.Arc, DamageType.Thermal] },
  { name: "Shielded Foes", hash: 3958417570, damageTypes: [DamageType.Thermal, DamageType.Void] },
  { name: "Shielded Foes", hash: 3139381566, damageTypes: [DamageType.Arc] },
  { name: "Shielded Foes", hash: 1553093202, damageTypes: [DamageType.Thermal] },
  { name: "Shielded Foes", hash: 3538098588, damageTypes: [DamageType.Void] },
  // Champion Foes
  { name: "Champion Foes", hash: 2006149364, breakerTypes: [DestinyBreakerType.ShieldPiercing, DestinyBreakerType.Disruption, DestinyBreakerType.Stagger] },
  { name: "Champion Foes", hash: 1990363418, breakerTypes: [DestinyBreakerType.ShieldPiercing, DestinyBreakerType.Disruption] },
  { name: "Champion Foes", hash: 438106166, breakerTypes: [DestinyBreakerType.ShieldPiercing, DestinyBreakerType.Stagger] },
  { name: "Champion Foes", hash: 3307318061, breakerTypes: [DestinyBreakerType.Stagger, DestinyBreakerType.Disruption] },
  { name: "Champion Foes", hash: 2475764450, breakerTypes: [DestinyBreakerType.Stagger] },
  { name: "Champions: Overload", hash: 1201462052, breakerTypes: [DestinyBreakerType.Disruption] },
  { name: "Champions: Barrier", hash: 1974619026, breakerTypes: [DestinyBreakerType.ShieldPiercing] },
  // Acute Burns
  { name: "Acute Arc Burn", hash: 258452800 },
  { name: "Acute Solar Burn", hash: 2931859389 },
  { name: "Acute Void Burn", hash: 1691458972 },
  // Burns
  { name: "Arc Burn", hash: 2495620299 },
  { name: "Solar Burn", hash: 434011922 },
  { name: "Void Burn", hash: 2295785649 },
];

export const getArtifactPerks = (
  characterProgression: DestinyCharacterProgressionComponent, manifest: AllDestinyManifestComponents
): AppArtifactType[] => {
  const artifactPerks = characterProgression.seasonalArtifact.tiers
    .flatMap(p => p.items)
    .map(p => ({
        item: p,
        definition: {...manifest.DestinyInventoryItemDefinition[p.itemHash]}
    }))
    // Filter down to only what the player has active
    .filter(p => p.item.isActive);

    artifactPerks.forEach(p => console.log(p.definition.displayProperties.name, p.item.itemHash, p));
  return artifactPerks;
}

export const getActivitiesData = (activities: DestinyPublicMilestone[], manifest: AllDestinyManifestComponents) => {
  const activitiesList = activities
    .filter(a => !!a.activities)
    .flatMap(a => a.activities)
    .filter(a => !!a.modifierHashes)
    .map(activity => {
      const modifiers = importantModifiers.filter(m => activity.modifierHashes.find(hash => m.hash === hash));
      const shieldTypes = modifiers.filter(m => m.damageTypes).flatMap(m => m.damageTypes as DamageType[]);
      const breakerTypes = modifiers.filter(m => m.breakerTypes).flatMap(m => m.breakerTypes as DestinyBreakerType[]);
      return {
        activity,
        definition: manifest.DestinyActivityDefinition[activity.activityHash],
        modifiers: modifiers.map(m => manifest.DestinyActivityModifierDefinition[m.hash]),
        shieldTypes,
        breakerTypes,
      };
    })
    // TODO: this could likely be filtered better. I'm trying to remove the encounters that dont have champions
    .filter(a => a.modifiers.length > 0);

  return [
    ...activitiesList.filter(
      (a, i) => activitiesList.findIndex(
        b => b.activity.activityHash.toString() === a.activity.activityHash.toString()) === i)
  ];
}
