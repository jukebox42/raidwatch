import { diffHashes } from "utils/common";
import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose } from "./enums";
import { finderMods } from "./mods";

/**
 * Identify if a mod belongs to the Ammo Finder list.
 */
export const isAmmoFinderSocket = (socket: AppSocketType) => {
  return !!finderMods.find(s => diffHashes(s.hash, socket.definition.hash));
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
