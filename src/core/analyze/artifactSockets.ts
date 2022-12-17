import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose } from "./enums";

// TODO: move to hashes
const specialDamageSockets = [
  "Solo Operative",
  "Monocromatic Maestro",
  "Advance Scout",
];

/**
 * Identify if a mod belongs to the artifact list.
 */
export const isArtifactSocket = (socket: AppSocketType) => {
  return socket.definition.displayProperties && specialDamageSockets.includes(socket.definition.displayProperties.name);
}

/**
 * Filter mods array down to mods that are artifact mods
 */
 export const filterArtifactSockets = (sockets: AppSocketType[]) => {
  return sockets.filter(s => isArtifactSocket(s)).map(s => (
    {
      ...s,
      purpose: SocketPurpose.artifactSockets,
      isUsable: SocketUsable.YES,
    }
  ));
 }
