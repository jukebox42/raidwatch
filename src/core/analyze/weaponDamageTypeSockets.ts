import { DamageType } from "bungie-api-ts/destiny2";
import intersection from "lodash/intersection";
import { diffHashes } from "utils/common";
import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose, SocketUnusableReason } from "./enums";

interface Mod {
  name: string;
  hash: number;
  elements: DamageType[];
  matchSubclass?: boolean;
}

const mods: Mod[] = [
  // TODO: Why are there two of everything? I think it's because of the cost reduction from the artifact.
  // === Dexterity ===
  { name: "Kinetic Dexterity", hash: 2076329105, elements: [DamageType.Kinetic] },
  { name: "Void Dexterity", hash: 467550918, elements: [DamageType.Void] },
  { name: "Arc Dexterity", hash: 2794359402, elements: [DamageType.Arc] },
  { name: "Solar Dexterity", hash: 3067648983, elements: [DamageType.Thermal] },
  { name: "Strand Dexterity", hash: 3323910164, elements: [DamageType.Strand] },
  { name: "Stasis Dexterity", hash: 193878019, elements: [DamageType.Stasis] },
  { name: "Harmonic Dexterity", hash: 1677180919, elements: [], matchSubclass: true },
  { name: "Kinetic Dexterity", hash: 1561736585, elements: [DamageType.Kinetic] },
  { name: "Void Dexterity", hash: 1017385934, elements: [DamageType.Void] },
  { name: "Arc Dexterity", hash: 2059068466, elements: [DamageType.Arc] },
  { name: "Solar Dexterity", hash: 531665167, elements: [DamageType.Thermal] },
  { name: "Strand Dexterity", hash: 3323910164, elements: [DamageType.Strand] },
  { name: "Stasis Dexterity", hash: 2267311547, elements: [DamageType.Stasis] },
  { name: "Harmonic Dexterity", hash: 1677180919, elements: [], matchSubclass: true },
  // === Holster ===
  { name: "Kinetic Holster", hash: 3276278122, elements: [DamageType.Kinetic] },
  { name: "Void Holster", hash: 2452545487, elements: [DamageType.Void] },
  { name: "Arc Holster", hash: 3798468567, elements: [DamageType.Arc] },
  { name: "Solar Holster", hash: 3675553168, elements: [DamageType.Thermal] },
  { name: "Strand Holster", hash: 3581696649, elements: [DamageType.Strand] },
  { name: "Stasis Holster", hash: 335129856, elements: [DamageType.Stasis] },
  { name: "Kinetic Holster", hash: 3573031954, elements: [DamageType.Kinetic] },
  { name: "Void Holster", hash: 2634786903, elements: [DamageType.Void] },
  { name: "Arc Holster", hash: 4294909663, elements: [DamageType.Arc] },
  { name: "Solar Holster", hash: 3775916472, elements: [DamageType.Thermal] },
  { name: "Strand Holster", hash: 2805854721, elements: [DamageType.Strand] },
  { name: "Stasis Holster", hash: 2801811288, elements: [DamageType.Stasis] },
  { name: "Harmonic Holster", hash: 3969361392, elements: [], matchSubclass: true },
  // === Loader ===
  { name: "Kinetic Loader", hash: 2237975061, elements: [DamageType.Kinetic] },
  { name: "Void Loader", hash: 3224649746, elements: [DamageType.Void] },
  { name: "Arc Loader", hash: 3046678542, elements: [DamageType.Arc] },
  { name: "Solar Loader", hash: 634608391, elements: [DamageType.Thermal] },
  { name: "Strand Loader", hash: 95934356, elements: [DamageType.Strand] },
  { name: "Stasis Loader", hash: 703902595, elements: [DamageType.Stasis] },
  { name: "Harmonic Loader", hash: 1702273159, elements: [], matchSubclass: true },
  { name: "Kinetic Loader", hash: 2586562813, elements: [DamageType.Kinetic] },
  { name: "Void Loader", hash: 3980769162, elements: [DamageType.Void] },
  { name: "Arc Loader", hash: 1125523126, elements: [DamageType.Arc] },
  { name: "Solar Loader", hash: 1079896271, elements: [DamageType.Thermal] },
  { name: "Strand Loader", hash: 4244246940, elements: [DamageType.Strand] },
  { name: "Stasis Loader", hash: 2793548555, elements: [DamageType.Stasis] },
  { name: "Harmonic Loader", hash: 2657604783, elements: [], matchSubclass: true },
  // === Reserves ===
  { name: "Kinetic Reserves", hash: 2305736470, elements: [DamageType.Kinetic] },
  { name: "Void Reserves", hash: 1669792723, elements: [DamageType.Void] },
  { name: "Arc Reserves", hash: 450381139, elements: [DamageType.Arc] },
  { name: "Solar Reserves", hash: 411014648, elements: [DamageType.Thermal] },
  { name: "Strand Reserves", hash: 2303417969, elements: [DamageType.Strand] },
  { name: "Stasis Reserves", hash: 3294892432, elements: [DamageType.Stasis] },
  { name: "Harmonic Reserves", hash: 1103878128, elements: [], matchSubclass: true },
  { name: "Kinetic Reserves", hash: 2407398462, elements: [DamageType.Kinetic] },
  { name: "Void Reserves", hash: 2413278875, elements: [DamageType.Void] },
  { name: "Arc Reserves", hash: 4283953067, elements: [DamageType.Arc] },
  { name: "Solar Reserves", hash: 2526773280, elements: [DamageType.Thermal] },
  { name: "Strand Reserves", hash: 4287822553, elements: [DamageType.Strand] },
  { name: "Stasis Reserves", hash: 3462414552, elements: [DamageType.Stasis] },
  { name: "Harmonic Reserves", hash: 1971149752, elements: [], matchSubclass: true },
  // === Scavenger ===
  { name: "Kinetic Scavenger", hash: 1097608874, elements: [DamageType.Kinetic] },
  { name: "Void Scavenger", hash: 2815817957, elements: [DamageType.Void] },
  { name: "Arc Scavenger", hash: 2436471653, elements: [DamageType.Arc] },
  { name: "Solar Scavenger", hash: 56663992, elements: [DamageType.Thermal] },
  { name: "Strand Scavenger", hash: 1305848463, elements: [DamageType.Strand] },
  { name: "Stasis Scavenger", hash: 2734674728, elements: [DamageType.Stasis] },
  { name: "Harmonic Scavenger", hash: 877723168, elements: [], matchSubclass: true },
  { name: "Kinetic Scavenger", hash: 579997810, elements: [DamageType.Kinetic] },
  { name: "Void Scavenger", hash: 2815817957, elements: [DamageType.Void] },
  { name: "Arc Scavenger", hash: 534479613, elements: [DamageType.Arc] },
  { name: "Solar Scavenger", hash: 688956976, elements: [DamageType.Thermal] },
  { name: "Strand Scavenger", hash: 2257238439, elements: [DamageType.Strand] },
  { name: "Stasis Scavenger", hash: 3174771856, elements: [DamageType.Stasis] },
  { name: "Harmonic Scavenger", hash: 2815817957, elements: [], matchSubclass: true },
  // === Siphon ===
  { name: "Kinetic Siphon", hash: 1388734897, elements: [DamageType.Kinetic] },
  { name: "Void Siphon", hash: 2773358872, elements: [DamageType.Void] },
  { name: "Arc Siphon", hash: 2724068510, elements: [DamageType.Arc] },
  { name: "Solar Siphon", hash: 4255093903, elements: [DamageType.Thermal] },
  { name: "Strand Siphon", hash: 3279257734, elements: [DamageType.Strand] },
  { name: "Kinetic Siphon", hash: 897335593, elements: [DamageType.Kinetic] },
  { name: "Void Siphon", hash: 1017385934, elements: [DamageType.Void] },
  { name: "Arc Siphon", hash: 3847471926, elements: [DamageType.Arc] },
  { name: "Solar Siphon", hash: 1086997255, elements: [DamageType.Thermal] },
  { name: "Strand Siphon", hash: 3926119246, elements: [DamageType.Strand] },
  { name: "Stasis Siphon", hash: 837201397, elements: [DamageType.Stasis] },
  { name: "Void/Strand Dual Siphon", hash: 110793779, elements: [DamageType.Void, DamageType.Strand] },
  { name: "Solar/Strand Dual Siphon", hash: 2831374162, elements: [DamageType.Thermal, DamageType.Strand] },
  { name: "Harmonic Siphon", hash: 3832366019, elements: [], matchSubclass: true },
  // === Surge ===
  { name: "Kinetic Weapon Surge", hash: 14520248, elements: [DamageType.Kinetic] },
  { name: "Void Weapon Surge", hash: 3467460423, elements: [DamageType.Void] },
  { name: "Arc Weapon Surge", hash: 1834163303, elements: [DamageType.Arc] },
  { name: "Solar Weapon Surge", hash: 2319885414, elements: [DamageType.Thermal] },
  { name: "Strand Weapon Surge", hash: 1501094193, elements: [DamageType.Strand] },
  { name: "Stasis Weapon Surge", hash: 2526922422, elements: [DamageType.Stasis] },
  { name: "Kinetic Weapon Surge", hash: 2318667184, elements: [DamageType.Kinetic] },
  { name: "Void Weapon Surge", hash: 3914973263, elements: [DamageType.Void] },
  { name: "Arc Weapon Surge", hash: 2246316031, elements: [DamageType.Arc] },
  { name: "Solar Weapon Surge", hash: 2283894334, elements: [DamageType.Thermal] },
  { name: "Strand Weapon Surge", hash: 3112965625, elements: [DamageType.Strand] },
  { name: "Stasis Weapon Surge", hash: 2921714558, elements: [DamageType.Stasis] },
  // === Targeting ===
  { name: "Kinetic Targeting", hash: 2214424583, elements: [DamageType.Kinetic] },
  { name: "Void Targeting", hash: 1589556860, elements: [DamageType.Void] },
  { name: "Arc Targeting", hash: 96682422, elements: [DamageType.Arc] },
  { name: "Solar Targeting", hash: 2719698929, elements: [DamageType.Thermal] },
  { name: "Strand Targeting", hash: 3000428062, elements: [DamageType.Strand] },
  { name: "Stasis Targeting", hash: 1801153435, elements: [DamageType.Stasis] },
  { name: "Harmonic Targeting", hash: 1891463783, elements: [], matchSubclass: true },
  { name: "Kinetic Targeting", hash: 2467203039, elements: [DamageType.Kinetic] },
  { name: "Void Targeting", hash: 2888195476, elements: [DamageType.Void] },
  { name: "Arc Targeting", hash: 967052942, elements: [DamageType.Arc] },
  { name: "Solar Targeting", hash: 331268185, elements: [DamageType.Thermal] },
  { name: "Strand Targeting", hash: 3013778406, elements: [DamageType.Strand] },
  { name: "Stasis Targeting", hash: 721001747, elements: [DamageType.Stasis] },
  { name: "Harmonic Targeting", hash: 1305536863, elements: [], matchSubclass: true },
  // === Unflinching Aim ===
  { name: "Unflinching Kinetic Aim", hash: 1262438062, elements: [DamageType.Kinetic] },
  { name: "Unflinching Void Aim", hash: 3437323171, elements: [DamageType.Void] },
  { name: "Unflinching Arc Aim", hash: 319908131, elements: [DamageType.Arc] },
  { name: "Unflinching Solar Aim", hash: 1553790504, elements: [DamageType.Thermal] },
  { name: "Unflinching Strand Aim", hash: 3598972737, elements: [DamageType.Strand] },
  { name: "Unflinching Stasis Aim", hash: 2959504464, elements: [DamageType.Stasis] },
  { name: "Unflinching Harmonic Aim", hash: 293178904, elements: [], matchSubclass: true },
  { name: "Unflinching Kinetic Aim", hash: 2325151798, elements: [DamageType.Kinetic] },
  { name: "Unflinching Void Aim", hash: 3887037435, elements: [DamageType.Void] },
  { name: "Unflinching Arc Aim", hash: 792400107, elements: [DamageType.Arc] },
  { name: "Unflinching Solar Aim", hash: 1019574576, elements: [DamageType.Thermal] },
  { name: "Unflinching Strand Aim", hash: 3979621113, elements: [DamageType.Strand] },
  { name: "Unflinching Stasis Aim", hash: 1118428792, elements: [DamageType.Stasis] },
  { name: "Unflinching Harmonic Aim", hash: 3094620656, elements: [], matchSubclass: true },
];

/**
 * Identify if a mod belongs to the weapon damage list.
 */
export const isWeaponDamageTypeSocket = (socket: AppSocketType) => {
  return !!mods.find(s => diffHashes(s.hash, socket.definition.hash));
}

const verifyUsable = (socket: AppSocketType, weaponDamageTypes: DamageType[], subclassDamageType: DamageType) => {
  const mod = mods.find(m => diffHashes(m.hash, socket.definition.hash));
  if (!mod) {
    return SocketUsable.MAYBE;
  }
  if (mod.matchSubclass && weaponDamageTypes.includes(subclassDamageType)) {
    return SocketUsable.YES;
  }
  if (mod.elements) {
    // console.log("SOCKET", socket.definition.displayProperties.name, weaponDamageTypes, mod.elements);
    return intersection(weaponDamageTypes, mod.elements).length > 0 ? SocketUsable.YES : SocketUsable.NO;
  }
  return SocketUsable.NO;
}

/**
 * Filter sockets array down to mods that are weapon damage sockets
 */
const filterWeaponDamageTypeSockets = (sockets: AppSocketType[]) => sockets.filter(s => isWeaponDamageTypeSocket(s));

export const analyzeWeaponDamageTypeSockets = (
  sockets: AppSocketType[],
  weaponDamageTypes: DamageType[],
  subclassDamageType: DamageType
): AppSocketType[] => {
  return filterWeaponDamageTypeSockets(sockets)
    .map(s => {
      const isUsable = verifyUsable(s, weaponDamageTypes, subclassDamageType);
      return {
        ...s,
        purpose: SocketPurpose.ammoFinderSockets,
        isUsable,
        unusableReason: isUsable === SocketUsable.YES ? undefined : SocketUnusableReason.missingDamageType,
      }
    })
    // Filter out anything that's good. We only wan't ones that aren't ok.
    .filter(s => s.isUsable !== SocketUsable.YES);
}
