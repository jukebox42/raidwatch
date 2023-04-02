import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose } from "./enums";

const scouts = [
  // === Artifact ===

  // === Rest ===
  { name: "Heavy Ammo Scout", hash: 1274140735 },
  { name: "Special Ammo Scout", hash: 25154119 },
];

/**
 * Identify if a mod belongs to the Ammo Scout list.
 */
export const isAmmoScoutSocket = (socket: AppSocketType) => {
  return !!scouts.find(s => s.hash.toString() === socket.definition.hash.toString());
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
