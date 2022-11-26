import { DamageType, DestinyEnergyType, DestinyItemSubType } from "bungie-api-ts/destiny2";
import intersection from "lodash/intersection";

import { AppSocketType, SocketUsable } from "../sockets";
import { SocketPurpose, SocketUnusableReason } from "./enums";

type Chargers = {
  name: string,
  hash: number, // the mod type hash
  sourceType?: DestinyItemSubType[], // the source of the generation
  alwaysTrue?: boolean, // if the mod is always going to generate.
}

type Spenders = {
  name: string,
  hash: number, // the mod type hash
  useType?: DestinyItemSubType[], // what spends it
  useDamageType?: DamageType, // what spends it damage
  useEnergyType?: DestinyEnergyType, // what spends it energy
  alwaysTrue?: boolean, // if the mod has no unique spend(like requiring a weapon ect)
}

const chargers: Chargers[] = [
  // === Artifact ===

  // === Rest ===
  { name: "Blast Radius", hash: 3185435911, sourceType: [DestinyItemSubType.RocketLauncher, DestinyItemSubType.GrenadeLauncher], },
  { name: "Charge Harvester", hash: 2263321587, alwaysTrue: true, },
  { name: "Empowered Finish", hash: 3632726236, alwaysTrue: true, },
  { name: "Precisely Charged", hash: 3523075122, sourceType: [DestinyItemSubType.FusionRifleLine, DestinyItemSubType.SniperRifle] },
  { name: "Precision Charge", hash: 2263321584, sourceType: [DestinyItemSubType.Bow, DestinyItemSubType.HandCannon, DestinyItemSubType.ScoutRifle] },
  { name: "Quick Charge", hash: 1484685884, sourceType: [DestinyItemSubType.FusionRifle, DestinyItemSubType.Shotgun] },
  { name: "Shield Break Charge", hash: 3632726239, alwaysTrue: true, },
  { name: "Sustained Charge", hash: 4272180933, sourceType: [DestinyItemSubType.AutoRifle, DestinyItemSubType.TraceRifle, DestinyItemSubType.Machinegun] },
  { name: "Swift Charge", hash: 2979815164, sourceType: [DestinyItemSubType.PulseRifle, DestinyItemSubType.Sidearm, DestinyItemSubType.SubmachineGun] },
  { name: "Taking Charge", hash: 3632726238, alwaysTrue: true, },
];

const friendChargers = [
  // === Artifact ===

  // === Rest ===
  { name: "Radiant Light", hash: 2979815167, requiresChargers: false },
  { name: "Powerful Friends", hash: 1484685887, requiresChargers: true },
]

const spenders: Spenders[] = [
  // === Artifact ===

  // === Rest ===
  { name: "Argent Ordnance", hash: 4272180932, useType: [DestinyItemSubType.RocketLauncher], },
  { name: "Energy Converter", hash: 2263321586, alwaysTrue: true },
  { name: "Extra Reserves", hash: 3523075121, useDamageType: DamageType.Void },
  { name: "Firepower", hash: 3185435908, alwaysTrue: true },
  { name: "Heal Thyself", hash: 3185435909, alwaysTrue: true },
  { name: "Heavy Handed", hash: 1484685886, alwaysTrue: true },
  { name: "High-Energy Fire", hash: 3632726237, alwaysTrue: true },
  { name: "Kindling the Flame", hash: 4272180935, alwaysTrue: true },
  { name: "Lucent Blade", hash: 2979815165, useType: [DestinyItemSubType.Sword] },
  { name: "Protective Light", hash: 3523075120, alwaysTrue: true },
  { name: "Reactive Pulse", hash: 2979815166, alwaysTrue: true },
  { name: "Striking Light", hash: 1484685885, alwaysTrue: true },
  { name: "Surprise Attack", hash: 2263321585, useType: [DestinyItemSubType.Sidearm] },
];

const itemTypeDisplayName = "Charged with Light Mod";
const isChargedWithLightSocket = (socket: AppSocketType) =>
  socket.definition.itemTypeDisplayName === itemTypeDisplayName;

/**
 * Filter mods array down to mods that generate charged with light.
 */
const filterChargedWithLightChargerSockets = (sockets: AppSocketType[]) => {
  return sockets.filter(s => {
    return isChargedWithLightSocket(s) && chargers.find(c => c.hash === s.definition.hash);
  });
};

/**
 * Filter mods array down to mods that spend charged with light.
 */
const filterChargedWithLightSpenderMods = (sockets: AppSocketType[]) => {
  return sockets.filter(s => {
    return isChargedWithLightSocket(s) && spenders.find(c => c.hash === s.definition.hash);
  });
}

const hasFriendChargers = (sockets: AppSocketType[], canCharge: boolean) => {
  sockets.forEach(socket => {
    const friendCharger = friendChargers.find(s => s.hash === socket.definition.hash);
    if (friendCharger) {
      if (friendCharger.requiresChargers && canCharge) {
        return true;
      }
    }
  });
  return false;
}

export const analyzeChargedWithLightChargerSockets = (
  sockets: AppSocketType[],
  weaponTypes: DestinyItemSubType[]
): { chargedWithLightChargerSockets: AppSocketType[], canCharge: boolean, canChargeFriends: boolean } => {
  const chargedWithLightChargerSockets = filterChargedWithLightChargerSockets(sockets)
    .map(socket => {
      const chargeSocket = { ...socket, purpose: SocketPurpose.chargedWithLightChargerSockets };
      const charger = chargers.find(m => m.hash === socket.definition.hash) as Chargers;

      // can always charge
      if (charger.alwaysTrue) {
        return {
          ...chargeSocket,
          isUsable: SocketUsable.YES,
        };
      }

      // check if weapons match(if the user has a weapon that is needed by a mod)
      if (charger.sourceType) {
        const matchingTraits = intersection(charger.sourceType, weaponTypes);
        const hasMatchingTraits = matchingTraits.length > 0
        return {
          ...chargeSocket,
          isUsable: hasMatchingTraits ? SocketUsable.YES : SocketUsable.NO,
          unusableReason: hasMatchingTraits ? undefined : SocketUnusableReason.missingWeapon,
        };
      }

      return {
        ...chargeSocket,
        isUsable: SocketUsable.NO,
        unusableReason: SocketUnusableReason.unknown,
      };
    });

  const canCharge = !!chargedWithLightChargerSockets.find(s => s.isUsable);
  const canChargeFriends = hasFriendChargers(sockets, canCharge);

  return { chargedWithLightChargerSockets, canCharge, canChargeFriends };
}

// TODO: Can Charge Allies?

export const analyzeChargedWithLightSpenderSockets = (
  sockets: AppSocketType[],
  weaponTypes: DestinyItemSubType[],
  weaponDamageTypes: DamageType[],
  subclassEnergy: DestinyEnergyType,
  hasChargers: boolean
): AppSocketType[] => {
  return filterChargedWithLightSpenderMods(sockets)
    .map(socket => {
      const spendSocket = { ...socket, purpose: SocketPurpose.chargedWithLightSpenderSockets };
      const spender = spenders.find(m => m.hash === socket.definition.hash) as Spenders;

      // If we can't charge with light warn
      if (!hasChargers) {
        return {
          ...spendSocket,
          isUsable: SocketUsable.MAYBE,
          unusableReason: SocketUnusableReason.missingLightCharger,
        };
      }

      // can always spend
      if (spender.alwaysTrue) {
        return {
          ...spendSocket,
          isUsable: SocketUsable.YES,
        };
      }

      // check if weapons match(if the user has a weapon that is needed by a mod)
      if (spender.useType) {
        const matchingTraits = intersection(spender.useType, weaponTypes);
        const hasMatchingTraits = matchingTraits.length > 0;
        return {
          ...spendSocket,
          isUsable: hasMatchingTraits ? SocketUsable.YES : SocketUsable.NO,
          unusableReason: hasMatchingTraits ? undefined : SocketUnusableReason.missingWeapon,
        };
      }

      // check if a required damage type matches
      if (spender.useDamageType !== undefined) {
        const hasMatchingEnergy = weaponDamageTypes.includes(spender.useDamageType);
        return {
          ...spendSocket,
          isUsable: hasMatchingEnergy ? SocketUsable.YES : SocketUsable.NO,
          unusableReason: hasMatchingEnergy ? undefined : SocketUnusableReason.missingEnergyType,
        };
      }

      return {
        ...spendSocket,
        isUsable: SocketUsable.NO,
        unusableReason: SocketUnusableReason.unknown,
      };
    });
}