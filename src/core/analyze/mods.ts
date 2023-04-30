import { DamageType, DestinyAmmunitionType } from "bungie-api-ts/destiny2";

export enum AnalyzeModType {
  AmmoFinder = 1,
  AmmoScout,
  WeaponDamageType,
  Raid,
}

type AnalyzeBaseMod = {
  hash: number,
  type: AnalyzeModType,
}

type AmmoMod = AnalyzeBaseMod & {
  ammoType: DestinyAmmunitionType,
}

export type AnalyzeAmmoFinderMod = AmmoMod & {
  type: AnalyzeModType.AmmoFinder,
};
export type AnalyzeAmmoScoutMod = AmmoMod & {
  type: AnalyzeModType.AmmoScout,
};

export type AnalyzeWeaponTypeMod = AnalyzeBaseMod & {
  type: AnalyzeModType.WeaponDamageType,
  damageTypes: DamageType[],
  mustMatchSubclass?: boolean,
}

export type AnalyzeRaidMod = AnalyzeBaseMod & {
  type: AnalyzeModType.Raid,
}

export type AnalyzeMod = AnalyzeAmmoFinderMod | AnalyzeAmmoScoutMod | AnalyzeWeaponTypeMod | AnalyzeRaidMod;

export const analyzeMods: AnalyzeMod[] = [
  // === Ammo Finder Mods ===

  // Special Ammo Finder
  { type: AnalyzeModType.AmmoFinder, hash: 3775800797, ammoType: DestinyAmmunitionType.Special },
  // Heavy Ammo Finder
  { type: AnalyzeModType.AmmoFinder, hash: 554409585, ammoType: DestinyAmmunitionType.Heavy },

  // === Ammo Scout Mods ===

  // Special Ammo Scout
  { type: AnalyzeModType.AmmoScout, hash: 25154119, ammoType: DestinyAmmunitionType.Special },
  // Heavy Ammo Scout
  { type: AnalyzeModType.AmmoScout, hash: 1274140735, ammoType: DestinyAmmunitionType.Heavy },

  // === Dexterity Mods ===

  // Kinetic Dexterity
  { type: AnalyzeModType.WeaponDamageType, hash: 2076329105, damageTypes: [DamageType.Kinetic] },
  { type: AnalyzeModType.WeaponDamageType, hash: 1561736585, damageTypes: [DamageType.Kinetic] },
  // Void Dexterity
  { type: AnalyzeModType.WeaponDamageType, hash: 467550918, damageTypes: [DamageType.Void] },
  { type: AnalyzeModType.WeaponDamageType, hash: 1017385934, damageTypes: [DamageType.Void] },
  
  // Arc Dexterity
  { type: AnalyzeModType.WeaponDamageType, hash: 2794359402, damageTypes: [DamageType.Arc] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2059068466, damageTypes: [DamageType.Arc] },
  // Solar Dexterity
  { type: AnalyzeModType.WeaponDamageType, hash: 3067648983, damageTypes: [DamageType.Thermal] },
  { type: AnalyzeModType.WeaponDamageType, hash: 531665167, damageTypes: [DamageType.Thermal] },
  // Strand Dexterity
  { type: AnalyzeModType.WeaponDamageType, hash: 3323910164, damageTypes: [DamageType.Strand] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3323910164, damageTypes: [DamageType.Strand] },
  // Stasis Dexterity
  { type: AnalyzeModType.WeaponDamageType, hash: 193878019, damageTypes: [DamageType.Stasis] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2267311547, damageTypes: [DamageType.Stasis] },
  // Harmonic Dexterity
  { type: AnalyzeModType.WeaponDamageType, hash: 1677180919, mustMatchSubclass: true, damageTypes: [] },
  { type: AnalyzeModType.WeaponDamageType, hash: 1677180919, mustMatchSubclass: true, damageTypes: [] },

  // === Holster Mods ===

  // Kinetic Holster
  { type: AnalyzeModType.WeaponDamageType, hash: 3276278122, damageTypes: [DamageType.Kinetic] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3573031954, damageTypes: [DamageType.Kinetic] },
  // Void Holster
  { type: AnalyzeModType.WeaponDamageType, hash: 2452545487, damageTypes: [DamageType.Void] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2634786903, damageTypes: [DamageType.Void] },
  // Arc Holster
  { type: AnalyzeModType.WeaponDamageType, hash: 3798468567, damageTypes: [DamageType.Arc] },
  { type: AnalyzeModType.WeaponDamageType, hash: 4294909663, damageTypes: [DamageType.Arc] },
  // Solar Holster
  { type: AnalyzeModType.WeaponDamageType, hash: 3675553168, damageTypes: [DamageType.Thermal] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3775916472, damageTypes: [DamageType.Thermal] },
  // Strand Holster
  { type: AnalyzeModType.WeaponDamageType, hash: 3581696649, damageTypes: [DamageType.Strand] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2805854721, damageTypes: [DamageType.Strand] },
  // Stasis Holster
  { type: AnalyzeModType.WeaponDamageType, hash: 335129856, damageTypes: [DamageType.Stasis] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2801811288, damageTypes: [DamageType.Stasis] },
  // Harmonic Holster
  { type: AnalyzeModType.WeaponDamageType, hash: 3969361392, mustMatchSubclass: true, damageTypes: [] },

  // === Loader Mods ===

  // Kinetic Loader
  { type: AnalyzeModType.WeaponDamageType, hash: 2237975061, damageTypes: [DamageType.Kinetic] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2586562813, damageTypes: [DamageType.Kinetic] },
  // Void Loader
  { type: AnalyzeModType.WeaponDamageType, hash: 3224649746, damageTypes: [DamageType.Void] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3980769162, damageTypes: [DamageType.Void] },
  // Arc Loader
  { type: AnalyzeModType.WeaponDamageType, hash: 3046678542, damageTypes: [DamageType.Arc] },
  { type: AnalyzeModType.WeaponDamageType, hash: 1125523126, damageTypes: [DamageType.Arc] },
  // Solar Loader
  { type: AnalyzeModType.WeaponDamageType, hash: 634608391, damageTypes: [DamageType.Thermal] },
  { type: AnalyzeModType.WeaponDamageType, hash: 1079896271, damageTypes: [DamageType.Thermal] },
  // Strand Loader
  { type: AnalyzeModType.WeaponDamageType, hash: 95934356, damageTypes: [DamageType.Strand] },
  { type: AnalyzeModType.WeaponDamageType, hash: 4244246940, damageTypes: [DamageType.Strand] },
  // Stasis Loader
  { type: AnalyzeModType.WeaponDamageType, hash: 703902595, damageTypes: [DamageType.Stasis] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2793548555, damageTypes: [DamageType.Stasis] },
  // Harmonic Loader
  { type: AnalyzeModType.WeaponDamageType, hash: 1702273159, mustMatchSubclass: true, damageTypes: [] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2657604783, mustMatchSubclass: true, damageTypes: [] },

  // === Reserves Mods ===

  // Kinetic Reserves
  { type: AnalyzeModType.WeaponDamageType, hash: 2305736470, damageTypes: [DamageType.Kinetic] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2407398462, damageTypes: [DamageType.Kinetic] },
  // Void Reserves
  { type: AnalyzeModType.WeaponDamageType, hash: 1669792723, damageTypes: [DamageType.Void] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2413278875, damageTypes: [DamageType.Void] },
  // Arc Reserves
  { type: AnalyzeModType.WeaponDamageType, hash: 450381139, damageTypes: [DamageType.Arc] },
  { type: AnalyzeModType.WeaponDamageType, hash: 4283953067, damageTypes: [DamageType.Arc] },
  // Solar Reserves
  { type: AnalyzeModType.WeaponDamageType, hash: 411014648, damageTypes: [DamageType.Thermal] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2526773280, damageTypes: [DamageType.Thermal] },
  // Strand Reserves
  { type: AnalyzeModType.WeaponDamageType, hash: 2303417969, damageTypes: [DamageType.Strand] },
  { type: AnalyzeModType.WeaponDamageType, hash: 4287822553, damageTypes: [DamageType.Strand] },
  // Stasis Reserves
  { type: AnalyzeModType.WeaponDamageType, hash: 3294892432, damageTypes: [DamageType.Stasis] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3462414552, damageTypes: [DamageType.Stasis] },
  // Harmonic Reserves
  { type: AnalyzeModType.WeaponDamageType, hash: 1103878128, mustMatchSubclass: true, damageTypes: [] },
  { type: AnalyzeModType.WeaponDamageType, hash: 1971149752, mustMatchSubclass: true, damageTypes: [] },

  // === Scavenger Mods ===

  // Kinetic Scavenger
  { type: AnalyzeModType.WeaponDamageType, hash: 1097608874, damageTypes: [DamageType.Kinetic] },
  { type: AnalyzeModType.WeaponDamageType, hash: 579997810, damageTypes: [DamageType.Kinetic] },
  // Void Scavenger
  { type: AnalyzeModType.WeaponDamageType, hash: 2815817957, damageTypes: [DamageType.Void] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2815817957, damageTypes: [DamageType.Void] },
  // Arc Scavenger
  { type: AnalyzeModType.WeaponDamageType, hash: 2436471653, damageTypes: [DamageType.Arc] },
  { type: AnalyzeModType.WeaponDamageType, hash: 534479613, damageTypes: [DamageType.Arc] },
  // Solar Scavenger
  { type: AnalyzeModType.WeaponDamageType, hash: 56663992, damageTypes: [DamageType.Thermal] },
  { type: AnalyzeModType.WeaponDamageType, hash: 688956976, damageTypes: [DamageType.Thermal] },
  // Strand Scavenger
  { type: AnalyzeModType.WeaponDamageType, hash: 1305848463, damageTypes: [DamageType.Strand] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2257238439, damageTypes: [DamageType.Strand] },
  // Stasis Scavenger
  { type: AnalyzeModType.WeaponDamageType, hash: 2734674728, damageTypes: [DamageType.Stasis] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3174771856, damageTypes: [DamageType.Stasis] },
  // Harmonic Scavenger
  { type: AnalyzeModType.WeaponDamageType, hash: 877723168, mustMatchSubclass: true, damageTypes: [] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2815817957, mustMatchSubclass: true, damageTypes: [] },

  // === Siphon Mods ===

  // Kinetic Siphon
  { type: AnalyzeModType.WeaponDamageType, hash: 1388734897, damageTypes: [DamageType.Kinetic] },
  { type: AnalyzeModType.WeaponDamageType, hash: 897335593, damageTypes: [DamageType.Kinetic] },
  // Void Siphon
  { type: AnalyzeModType.WeaponDamageType, hash: 2773358872, damageTypes: [DamageType.Void] },
  { type: AnalyzeModType.WeaponDamageType, hash: 1017385934, damageTypes: [DamageType.Void] },
  // Arc Siphon
  { type: AnalyzeModType.WeaponDamageType, hash: 2724068510, damageTypes: [DamageType.Arc] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3847471926, damageTypes: [DamageType.Arc] },
  // Solar Siphon
  { type: AnalyzeModType.WeaponDamageType, hash: 4255093903, damageTypes: [DamageType.Thermal] },
  { type: AnalyzeModType.WeaponDamageType, hash: 1086997255, damageTypes: [DamageType.Thermal] },
  // Strand Siphon
  { type: AnalyzeModType.WeaponDamageType, hash: 3279257734, damageTypes: [DamageType.Strand] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3926119246, damageTypes: [DamageType.Strand] },
  // Stasis Siphon
  { type: AnalyzeModType.WeaponDamageType, hash: 837201397, damageTypes: [DamageType.Stasis] },
  // Void/Strand Dual Siphon
  { type: AnalyzeModType.WeaponDamageType, hash: 110793779, damageTypes: [DamageType.Void, DamageType.Strand] },
  // Solar/Strand Dual Siphon
  { type: AnalyzeModType.WeaponDamageType, hash: 2831374162, damageTypes: [DamageType.Thermal, DamageType.Strand] },
  // Harmonic Siphon
  { type: AnalyzeModType.WeaponDamageType, hash: 3832366019, mustMatchSubclass: true, damageTypes: [] },

  // === Surge ===

  // Kinetic Weapon Surge
  { type: AnalyzeModType.WeaponDamageType, hash: 14520248, damageTypes: [DamageType.Kinetic] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2318667184, damageTypes: [DamageType.Kinetic] },
  // Void Weapon Surge
  { type: AnalyzeModType.WeaponDamageType, hash: 3467460423, damageTypes: [DamageType.Void] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3914973263, damageTypes: [DamageType.Void] },
  // Arc Weapon Surge
  { type: AnalyzeModType.WeaponDamageType, hash: 1834163303, damageTypes: [DamageType.Arc] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2246316031, damageTypes: [DamageType.Arc] },
  // Solar Weapon Surge
  { type: AnalyzeModType.WeaponDamageType, hash: 2319885414, damageTypes: [DamageType.Thermal] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2283894334, damageTypes: [DamageType.Thermal] },
  // Strand Weapon Surge
  { type: AnalyzeModType.WeaponDamageType, hash: 1501094193, damageTypes: [DamageType.Strand] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3112965625, damageTypes: [DamageType.Strand] },
  // Stasis Weapon Surge
  { type: AnalyzeModType.WeaponDamageType, hash: 2526922422, damageTypes: [DamageType.Stasis] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2921714558, damageTypes: [DamageType.Stasis] },

  // === Targeting Mods ===

  // Kinetic Targeting
  { type: AnalyzeModType.WeaponDamageType, hash: 2214424583, damageTypes: [DamageType.Kinetic] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2467203039, damageTypes: [DamageType.Kinetic] },
  // Void Targeting
  { type: AnalyzeModType.WeaponDamageType, hash: 1589556860, damageTypes: [DamageType.Void] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2888195476, damageTypes: [DamageType.Void] },
  // Arc Targeting
  { type: AnalyzeModType.WeaponDamageType, hash: 96682422, damageTypes: [DamageType.Arc] },
  { type: AnalyzeModType.WeaponDamageType, hash: 967052942, damageTypes: [DamageType.Arc] },
  // Solar Targeting
  { type: AnalyzeModType.WeaponDamageType, hash: 2719698929, damageTypes: [DamageType.Thermal] },
  { type: AnalyzeModType.WeaponDamageType, hash: 331268185, damageTypes: [DamageType.Thermal] },
  // Strand Targeting
  { type: AnalyzeModType.WeaponDamageType, hash: 3000428062, damageTypes: [DamageType.Strand] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3013778406, damageTypes: [DamageType.Strand] },
  // Stasis Targeting
  { type: AnalyzeModType.WeaponDamageType, hash: 1801153435, damageTypes: [DamageType.Stasis] },
  { type: AnalyzeModType.WeaponDamageType, hash: 721001747, damageTypes: [DamageType.Stasis] },
  // Harmonic Targeting
  { type: AnalyzeModType.WeaponDamageType, hash: 1891463783, mustMatchSubclass: true, damageTypes: [] },
  { type: AnalyzeModType.WeaponDamageType, hash: 1305536863, mustMatchSubclass: true, damageTypes: [] },

  // === Unflinching Aim Mods ===

  // Unflinching Kinetic Aim
  { type: AnalyzeModType.WeaponDamageType, hash: 1262438062, damageTypes: [DamageType.Kinetic] },
  { type: AnalyzeModType.WeaponDamageType, hash: 2325151798, damageTypes: [DamageType.Kinetic] },
  // Unflinching Void Aim
  { type: AnalyzeModType.WeaponDamageType, hash: 3437323171, damageTypes: [DamageType.Void] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3887037435, damageTypes: [DamageType.Void] },
  // Unflinching Arc Aim
  { type: AnalyzeModType.WeaponDamageType, hash: 319908131, damageTypes: [DamageType.Arc] },
  { type: AnalyzeModType.WeaponDamageType, hash: 792400107, damageTypes: [DamageType.Arc] },
  // Unflinching Solar Aim
  { type: AnalyzeModType.WeaponDamageType, hash: 1553790504, damageTypes: [DamageType.Thermal] },
  { type: AnalyzeModType.WeaponDamageType, hash: 1019574576, damageTypes: [DamageType.Thermal] },
  // Unflinching Strand Aim
  { type: AnalyzeModType.WeaponDamageType, hash: 3598972737, damageTypes: [DamageType.Strand] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3979621113, damageTypes: [DamageType.Strand] },
  // Unflinching Stasis Aim
  { type: AnalyzeModType.WeaponDamageType, hash: 2959504464, damageTypes: [DamageType.Stasis] },
  { type: AnalyzeModType.WeaponDamageType, hash: 1118428792, damageTypes: [DamageType.Stasis] },
  // Unflinching Harmonic Aim
  { type: AnalyzeModType.WeaponDamageType, hash: 293178904, mustMatchSubclass: true, damageTypes: [] },
  { type: AnalyzeModType.WeaponDamageType, hash: 3094620656, mustMatchSubclass: true, damageTypes: [] },
];

export const isHarmonic = (hash: number) => {
  return !!(analyzeMods as AnalyzeWeaponTypeMod[]).find(m => m.hash === hash && m.mustMatchSubclass);
}
