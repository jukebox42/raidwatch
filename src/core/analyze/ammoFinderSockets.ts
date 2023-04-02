import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose } from "./enums";

const finders = [
  // === Artifact ===

  // === Rest ===
  { name: "Heavy Ammo Finder", hash: 554409585 },
  { name: "Special Ammo Finder", hash: 3775800797 },
];

/**
 * Identify if a mod belongs to the Ammo Finder list.
 */
export const isAmmoFinderSocket = (socket: AppSocketType) => {
  return !!finders.find(s => s.hash.toString() === socket.definition.hash.toString());
}

/**
 * Filter sockets array down to mods that are ammo finder sockets
 */
const filterAmmoFinderSockets = (sockets: AppSocketType[]) => sockets.filter(s => isAmmoFinderSocket(s));

export const analyzeAmmoFinderSockets = (sockets: AppSocketType[]): AppSocketType[] => {
  return filterAmmoFinderSockets(sockets)
    .map(s => {
      return {
        ...s,
        purpose: SocketPurpose.ammoFinderSockets,
        isUsable: SocketUsable.YES,
        unusableReason: undefined,
      }
    });
}
