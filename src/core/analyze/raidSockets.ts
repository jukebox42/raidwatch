import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose } from "./enums";

const isRaidSocket = (socket: AppSocketType) => {
  return socket.definition.displayProperties && socket.definition.plug &&
         /enhancements.raid/.test(socket.definition.plug.plugCategoryIdentifier) &&
         socket.definition.displayProperties.name !== "Empty Mod Socket";
}

/**
 * Filter mods array down to mods that are raid mods
 */
export const filterRaidSockets = (sockets: AppSocketType[]) => {
  return sockets.filter(s => isRaidSocket(s)).map(s => (
    {
      ...s,
      purpose: SocketPurpose.raidSockets,
      isUsable: SocketUsable.YES,
    }
  ));
}
