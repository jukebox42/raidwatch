import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose, SocketUnusableReason } from "./enums";
import { weaponMap } from "./helpers";

/**
 * Identify if a mod belongs to the Ammo Scavenger list.
 * 
 * TODO: move to hash checks
 */
export const isAmmoScavengerSocket = (socket: AppSocketType) => {
  return socket.definition.displayProperties && /Scavenger$/.test(socket.definition.displayProperties.name);
}

/**
 * Filter sockets array down to mods that are ammo scavenger sockets
 */
const filterAmmoScavengerSockets = (sockets: AppSocketType[]) => sockets.filter(s => isAmmoScavengerSocket(s));

export const analyzeAmmoScavengerSockets = (sockets: AppSocketType[], weaponTypes: number[]): AppSocketType[] => {
  const presentWeaponMap = weaponMap.filter(w => weaponTypes.includes(w.type));
  return filterAmmoScavengerSockets(sockets)
    .map(s => {
      const hasWeapon = !!presentWeaponMap.find(w => s.definition.displayProperties.name.indexOf(w.name) === 0)
      return {
        ...s,
        purpose: SocketPurpose.ammoScavengerSockets,
        isUsable: hasWeapon ? SocketUsable.YES : SocketUsable.NO,
        unusableReason: hasWeapon ? undefined : SocketUnusableReason.missingWeapon,
      }
    });
}
