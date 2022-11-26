import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose, SocketUnusableReason } from "./enums";
import { weaponMap } from "./helpers";

/**
 * Identify if a mod belongs to the Ammo Finder list.
 * 
 * TODO: move to hash checks
 */
const isAmmoFinderSocket = (socket: AppSocketType) => socket.definition.displayProperties &&
                           /Ammo Finder$/.test(socket.definition.displayProperties.name);

/**
 * Filter sockets array down to mods that are ammo finder sockets
 */
const filterAmmoFinderSockets = (sockets: AppSocketType[]) => sockets.filter(s => isAmmoFinderSocket(s));

export const analyzeAmmoFinderSockets = (sockets: AppSocketType[], weaponTypes: number[]): AppSocketType[] => {
  const presentWeaponMap = weaponMap.filter(w => weaponTypes.includes(w.type));
  return filterAmmoFinderSockets(sockets)
    .map(s => {
      const hasWeapon = !!presentWeaponMap.find(w => s.definition.displayProperties.name.indexOf(w.name) === 0);
      return {
        ...s,
        purpose: SocketPurpose.ammoFinderSockets,
        isUsable: hasWeapon ? SocketUsable.YES : SocketUsable.NO,
        unusableReason: hasWeapon ? undefined : SocketUnusableReason.missingWeapon,
      }
    });
}
