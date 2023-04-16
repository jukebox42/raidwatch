import { diffHashes } from "utils/common";
import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose } from "./enums";
import { scoutMods } from "./mods";

/**
 * Identify if a mod belongs to the Ammo Scout list.
 */
export const isAmmoScoutSocket = (socket: AppSocketType) => {
  return !!scoutMods.find(s => diffHashes(s.hash, socket.definition.hash));
}

/**
 * Filter sockets array down to mods that are ammo scout sockets
 */
const filterAmmoScoutSockets = (sockets: AppSocketType[]) => sockets.filter(s => isAmmoScoutSocket(s));

export const analyzeAmmoScoutSockets = (sockets: AppSocketType[]): AppSocketType[] => {
  return filterAmmoScoutSockets(sockets)
    .map(s => {
      return {
        ...s,
        purpose: SocketPurpose.ammoScoutSockets,
        isUsable: SocketUsable.YES,
        unusableReason: undefined,
      }
    });
}
