import intersection from "lodash/intersection";

import { AppSocketType, SocketUsable } from "../sockets";

import { DestinyEnergyType, DestinyItemSubType } from "bungie-api-ts/destiny2";
import { SocketPurpose, SocketUnusableReason } from "./enums";

type ChampionSocketTypes = {
  name: string,
  hash: number,
  requiredTypes?: DestinyItemSubType[],
  requiredSubclassEnergyTypes?: DestinyEnergyType[],
}

const championSockets: ChampionSocketTypes[] = [
  // === Artifact ===
  { name: "Overload Bow", hash: 3521781038, requiredTypes: [DestinyItemSubType.Bow] },
  { name: "Unstoppable Pulse Rifle", hash: 3521781037, requiredTypes: [DestinyItemSubType.PulseRifle] },
  { name: "Anti-Barrier Scout Rifle", hash: 3521781036, requiredTypes: [DestinyItemSubType.ScoutRifle] },
  { name: "Anti-Barrier Auto Rifle", hash: 3521781035, requiredTypes: [DestinyItemSubType.AutoRifle] },
  { name: "Unstoppable Shotgun", hash: 3521781034, requiredTypes: [DestinyItemSubType.Shotgun] },
  { name: "Overload Machine Guns", hash: 1404465537, requiredTypes: [DestinyItemSubType.Machinegun] },
  { name: "Anti-Barrier Sniper Rifle", hash: 1404465538, requiredTypes: [DestinyItemSubType.SniperRifle] },
  { name: "Inferno Whip", hash: 1404465541, requiredSubclassEnergyTypes: [DestinyEnergyType.Thermal] },
  { name: "Surge Detonators", hash: 1404465540, requiredSubclassEnergyTypes: [DestinyEnergyType.Arc] },
];

/**
 * Identify if a mod belongs to the Champion list.
 * 
 * TODO: move to hash checks
 */
const isChampionSocket = (socket: AppSocketType) => 
  /^(Unstoppable|Anti-Barrier|Overload|Inferno Whip|Surge Detonators)/.test(socket.definition.displayProperties.name);

/**
 * Filter mods array down to mods that are champion mods
 */
const filterChampionSockets = (sockets: AppSocketType[]) => sockets.filter(s => isChampionSocket(s));

/**
 * 
 * @param sockets 
 * @param weaponTypes 
 * @param subclassEnergy 
 * @returns 
 */
export const analyzeChampionSockets = (
  sockets: AppSocketType[],
  weaponTypes: DestinyItemSubType[],
  subclassEnergy: DestinyEnergyType
): AppSocketType[] => {
  return filterChampionSockets(sockets)
    .map(socket => {
      const champSocket = { ...socket, purpose: SocketPurpose.championSockets, isUsable: SocketUsable.NO };
      const championSocket = championSockets.find(s => s.hash === socket.definition.hash);
      if (!championSocket) {
        console.error("FAILED TO FIND CHAMPION MOD. MISSING FROM ARRAY", socket);
        return {
          ...champSocket,
          isUsable: SocketUsable.MAYBE,
          unusableReason: SocketUnusableReason.unknown,
        };
      }

      // if the mod depends on a specific weapon type
      if (championSocket.requiredTypes) {
        const matchingTraits = intersection(championSocket.requiredTypes, weaponTypes);
        const hasMatchingTrait = matchingTraits.length > 0;
        return {
          ...champSocket,
          isUsable: hasMatchingTrait ? SocketUsable.YES : SocketUsable.NO,
          unusableReason: hasMatchingTrait ? undefined : SocketUnusableReason.missingWeapon,
        };
      }

      // if the mod depends on a subclass energy type
      if (championSocket.requiredSubclassEnergyTypes) {
        const matchesSubclass = championSocket.requiredSubclassEnergyTypes.includes(subclassEnergy);
        return {
          ...champSocket,
          isUsable: matchesSubclass ? SocketUsable.YES : SocketUsable.NO,
          unusableReason: matchesSubclass ? undefined : SocketUnusableReason.wrongSubclass,
        };
      }

      return champSocket;
    });
}

export const analyzeChampionSocketTypes = (sockets: AppSocketType[]) => {
  return sockets
    .filter(s => s.isUsable)
    .map(s => ({
      hash: (s.definition.breakerTypeHash as number).toString(),
      sourceName: s.definition.displayProperties.name }));
}
