import { DamageType } from "bungie-api-ts/destiny2";
import intersection from "lodash/intersection";
import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose, SocketUnusableReason } from "./enums";

interface Mod {
  name: string;
  hash: number;
  element?: DamageType;
  elements?: DamageType[];
  all?: boolean;
}

const mods: Mod[] = [
  // === Scavenger ===
  { name: "Kinetic Scavenger", hash: 579997810, element: DamageType.Kinetic },
  { name: "Void Scavenger", hash: 2815817957, element: DamageType.Void },
  { name: "Arc Scavenger", hash: 534479613, element: DamageType.Arc },
  { name: "Solar Scavenger", hash: 688956976, element: DamageType.Thermal },
  { name: "Strand Scavenger", hash: 2257238439, element: DamageType.Strand },
  { name: "Stasis Scavenger", hash: 3174771856, element: DamageType.Stasis },
  { name: "Harmonic Scavenger", hash: 2815817957, all: true },
  // === Holster ===
  { name: "Kinetic Holster", hash: 3573031954, element: DamageType.Kinetic },
  { name: "Void Holster", hash: 2634786903, element: DamageType.Void },
  { name: "Arc Holster", hash: 4294909663, element: DamageType.Arc },
  { name: "Solar Holster", hash: 3775916472, element: DamageType.Thermal },
  { name: "Strand Holster", hash: 2805854721, element: DamageType.Strand },
  { name: "Stasis Holster", hash: 2801811288, element: DamageType.Stasis },
  { name: "Harmonic Holster", hash: 3969361392, all: true },
  // === Unflinching Aim ===
  { name: "Unflinching Kinetic Aim", hash: 2325151798, element: DamageType.Kinetic },
  { name: "Unflinching Void Aim", hash: 3887037435, element: DamageType.Void },
  { name: "Unflinching Arc Aim", hash: 792400107, element: DamageType.Arc },
  { name: "Unflinching Solar Aim", hash: 1019574576, element: DamageType.Thermal },
  { name: "Unflinching Strand Aim", hash: 3979621113, element: DamageType.Strand },
  { name: "Unflinching Stasis Aim", hash: 1118428792, element: DamageType.Stasis },
  { name: "Unflinching Harmonic Aim", hash: 3094620656, all: true },
  // === Reserves ===
  { name: "Kinetic Reserves", hash: 2407398462, element: DamageType.Kinetic },
  { name: "Void Reserves", hash: 2413278875, element: DamageType.Void },
  { name: "Arc Reserves", hash: 4283953067, element: DamageType.Arc },
  { name: "Solar Reserves", hash: 2526773280, element: DamageType.Thermal },
  { name: "Strand Reserves", hash: 4287822553, element: DamageType.Strand },
  { name: "Stasis Reserves", hash: 3462414552, element: DamageType.Stasis },
  { name: "Harmonic Reserves", hash: 1971149752, all: true },
  // === Loader ===
  { name: "Kinetic Loader", hash: 2586562813, element: DamageType.Kinetic },
  { name: "Void Loader", hash: 3980769162, element: DamageType.Void },
  { name: "Arc Loader", hash: 1125523126, element: DamageType.Arc },
  { name: "Solar Loader", hash: 1079896271, element: DamageType.Thermal },
  { name: "Strand Loader", hash: 4244246940, element: DamageType.Strand },
  { name: "Stasis Loader", hash: 2793548555, element: DamageType.Stasis },
  { name: "Harmonic Loader", hash: 2657604783, all: true },
  // === Targeting ===
  { name: "Kinetic Targeting", hash: 2467203039, element: DamageType.Kinetic },
  { name: "Void Targeting", hash: 2888195476, element: DamageType.Void },
  { name: "Arc Targeting", hash: 967052942, element: DamageType.Arc },
  { name: "Solar Targeting", hash: 331268185, element: DamageType.Thermal },
  { name: "Strand Targeting", hash: 3013778406, element: DamageType.Strand },
  { name: "Stasis Targeting", hash: 721001747, element: DamageType.Stasis },
  { name: "Harmonic Targeting", hash: 1305536863, all: true },
  // === Siphon ===
  { name: "Kinetic Siphon", hash: 897335593, element: DamageType.Kinetic },
  { name: "Void Siphon", hash: 1017385934, element: DamageType.Void },
  { name: "Arc Siphon", hash: 3847471926, element: DamageType.Arc },
  { name: "Solar Siphon", hash: 1086997255, element: DamageType.Thermal },
  { name: "Strand Siphon", hash: 3926119246, element: DamageType.Strand },
  { name: "Stasis Siphon", hash: 837201397, element: DamageType.Stasis },
  { name: "Void/Strand Dual Siphon", hash: 110793779, elements: [DamageType.Void, DamageType.Strand] },
  { name: "Solar/Strand Dual Siphon", hash: 2831374162, elements: [DamageType.Thermal, DamageType.Strand] },
  { name: "Harmonic Siphon", hash: 3832366019, all: true },
  // === Dexterity ===
  { name: "Kinetic Dexterity", hash: 1561736585, element: DamageType.Kinetic },
  { name: "Void Dexterity", hash: 1017385934, element: DamageType.Void },
  { name: "Arc Dexterity", hash: 2059068466, element: DamageType.Arc },
  { name: "Solar Dexterity", hash: 531665167, element: DamageType.Thermal },
  { name: "Strand Dexterity", hash: 3323910164, element: DamageType.Strand },
  { name: "Stasis Dexterity", hash: 2267311547, element: DamageType.Stasis },
  { name: "Harmonic Dexterity", hash: 2479297167, all: true },
  // === Surge ===
  { name: "Kinetic Weapon Surge", hash: 2318667184, element: DamageType.Kinetic },
  { name: "Void Weapon Surge", hash: 3914973263, element: DamageType.Void },
  { name: "Arc Weapon Surge", hash: 2246316031, element: DamageType.Arc },
  { name: "Solar Weapon Surge", hash: 2283894334, element: DamageType.Thermal },
  { name: "Strand Weapon Surge", hash: 3112965625, element: DamageType.Strand },
  { name: "Stasis Weapon Surge", hash: 2921714558, element: DamageType.Stasis },
];

/**
 * Identify if a mod belongs to the weapon damage list.
 */
export const isWeaponDamageTypeSocket = (socket: AppSocketType) => {
  return !!mods.find(s => s.hash.toString() === socket.definition.hash.toString());
}

const verifyUsable = (mod: Mod | undefined, weaponDamageTypes: DamageType[]) => {
  if (!mod) {
    return SocketUsable.MAYBE;
  }
  if (mod.all) {
    return SocketUsable.YES;
  }
  if (mod.element) {
    return weaponDamageTypes.includes(mod.element) ? SocketUsable.YES : SocketUsable.NO;
  }
  if (mod.elements) {
    return intersection(weaponDamageTypes, mod.elements).length > 0 ? SocketUsable.YES : SocketUsable.NO;
  }
  return SocketUsable.NO;
}

/**
 * Filter sockets array down to mods that are weapon damage sockets
 */
const filterWeaponDamageTypeSockets = (sockets: AppSocketType[]) => sockets.filter(s => isWeaponDamageTypeSocket(s));

export const analyzeWeaponDamageTypeSockets = (sockets: AppSocketType[], weaponDamageTypes: DamageType[]): AppSocketType[] => {
  return filterWeaponDamageTypeSockets(sockets)
    .map(s => {
      const mod = mods.find(m => m.hash.toString() === s.definition.hash.toString());
      const isUsable = verifyUsable(mod, weaponDamageTypes);
      return {
        ...s,
        purpose: SocketPurpose.ammoFinderSockets,
        isUsable,
        unusableReason: isUsable === SocketUsable.YES ? undefined : SocketUnusableReason.missingDamageType,
      }
    });
}
