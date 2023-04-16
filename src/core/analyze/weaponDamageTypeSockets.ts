import { DamageType } from "bungie-api-ts/destiny2";
import intersection from "lodash/intersection";
import { diffHashes } from "utils/common";
import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose, SocketUnusableReason } from "./enums";
import { weaponTypeMods } from "./mods";


/**
 * Identify if a mod belongs to the weapon damage list.
 */
export const isWeaponDamageTypeSocket = (socket: AppSocketType) => {
  return !!weaponTypeMods.find(s => diffHashes(s.hash, socket.definition.hash));
}

const verifyUsable = (socket: AppSocketType, weaponDamageTypes: DamageType[], subclassDamageType: DamageType) => {
  const mod = weaponTypeMods.find(m => diffHashes(m.hash, socket.definition.hash));
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
