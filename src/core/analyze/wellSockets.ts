import { DamageType, DestinyEnergyType } from "bungie-api-ts/destiny2";

import { AppSocketType, SocketUsable } from "../sockets";
import { energyTypeToDamageType } from "./helpers";
import { SocketPurpose, SocketUnusableReason } from "./enums";

enum src {
  WEAPON = 1,
  EXPLOSIVE,
};

type Generators = {
  name: string,
  hash: number, // the mod type hash
  matchSubclass: boolean, // if the source and subclass need to match
  energy?: DestinyEnergyType, // the energy type this is generated. this is missing if it matches the subclass
  source?: src, // the source of the well generation, nothing means subclass abilities
  alwaysTrue?: boolean, // if the mod is always going to generate. denotes smething we can't really track well
}

type Spenders = {
  name: string;
  hash: number; // the mod type hash
  matchSubclass: boolean, // if the well type and subclass need to match
  energy?: DestinyEnergyType, // the well energy type that is needed. empty means any (see matchSubclass)
}

/**
 * TODO: Pull from database instead of hard code
 */
const chargers: Generators[] = [
  // === Artifact ===

  // === Rest ===
  { name: "Elemental Armaments", hash: 1515669996, matchSubclass: true, source: src.WEAPON, },
  { name: "Elemental Light", hash: 2823326549, matchSubclass: true, },
  { name: "Elemental Ordnance", hash: 1824486242, matchSubclass: true, },
  // TODO: stasis shards could come from anywhere so always show true
  { name: "Elemental Shards", hash: 1977242752, matchSubclass: false, energy: DestinyEnergyType.Stasis, alwaysTrue: true, },
  // TODO: this isn't tracked atm. will always show true
  { name: "Explosive Wellmaker", hash: 825650462, matchSubclass: false, source: src.EXPLOSIVE, energy: DestinyEnergyType.Thermal, alwaysTrue: true, },
  { name: "Melee Wellmaker", hash: 4213142382, matchSubclass: true, },
  { name: "Overcharge Wellmaker", hash: 3097132144, matchSubclass: false, energy: DestinyEnergyType.Arc, },
  { name: "Reaping Wellmaker", hash: 240958661, matchSubclass: false, energy: DestinyEnergyType.Void, },
  // TODO: this isn't properly tracked. will always show true
  { name: "Shieldcrash Wellmaker", hash: 1052528480, matchSubclass: false, energy: DestinyEnergyType.Void, alwaysTrue: true, },
  { name: "Supreme Wellmaker", hash: 1977242753, matchSubclass: false, energy: DestinyEnergyType.Stasis, },
];

const spenders: Spenders[] = [
  // === Artifact ===
  
  // === Rest ===
  { name: "Font of Might", hash: 1740246051, matchSubclass: true, },
  { name: "Font of Wisdom", hash: 1196831979, matchSubclass: true, },
  { name: "Well of Ions", hash: 1680735357, matchSubclass: false, energy: DestinyEnergyType.Arc, },
  { name: "Well of Life", hash: 2164090163, matchSubclass: false, energy: DestinyEnergyType.Thermal, },
  { name: "Well of Ordnance", hash: 4288515061, matchSubclass: false, energy: DestinyEnergyType.Thermal, },
  { name: "Well of Restoration", hash: 1977242755, matchSubclass: false, energy: DestinyEnergyType.Stasis, },
  { name: "Well of Striking", hash: 4044800076, matchSubclass: false, energy: DestinyEnergyType.Arc, },
  { name: "Well of Tenacity", hash: 3809244044, matchSubclass: false, energy: DestinyEnergyType.Void, },
  { name: "Well of Utility", hash: 1358633824, matchSubclass: false, energy: DestinyEnergyType.Void, },
];

const itemTypeDisplayName = "Elemental Well Mod";
export const isWellSocket = (socket: AppSocketType) => socket.definition.itemTypeDisplayName === itemTypeDisplayName;

/**
 * Filter mods array down to mods that generate wells.
 */
const filterWellGeneratorSockets = (sockets: AppSocketType[]) => {
  return sockets.filter(s => {
    return isWellSocket(s) && chargers.find(c => c.hash === s.definition.hash);
  });
};

/**
 * Filter mods array down to mods that spend wells.
 */
const filterWellSpenderSockets = (sockets: AppSocketType[]) => {
  return sockets.filter(s => {
    return isWellSocket(s) && spenders.find(c => c.hash === s.definition.hash);
  });
}

export const analyzeWellGeneratorSockets = (
  sockets: AppSocketType[],
  weaponDamageTypes: DamageType[],
  subclassEnergy: DestinyEnergyType
): { wellGeneratorSockets: AppSocketType[], generatedWellEnergies: DestinyEnergyType[] } => {
  const generatedWellEnergies: DestinyEnergyType[] = [];
  const wellSockets = filterWellGeneratorSockets(sockets).map(socket => {
    const genSocket = { ...socket, purpose: SocketPurpose.wellGeneratorSockets };
    const charger = chargers.find(s => s.hash === socket.definition.hash) as Generators;
    // can always create.
    if (charger.alwaysTrue) {
      if (charger.energy) {
        generatedWellEnergies.push(charger.energy);
        return {
          ...genSocket,
          isUsable: SocketUsable.YES,
        }
      }
      generatedWellEnergies.push(subclassEnergy);
      return {
        ...genSocket,
        isUsable: SocketUsable.YES,
      }
    }

    // if no source then it will always trigger and we just need to return the well type
    if (!charger.source) {
      if (charger.matchSubclass) {
        generatedWellEnergies.push(subclassEnergy);
        return {
          ...genSocket,
          isUsable: SocketUsable.YES,
        }
      }
      if (charger.energy) {
        generatedWellEnergies.push(subclassEnergy);
        return {
          ...genSocket,
          isUsable: SocketUsable.YES,
        }
      }
    }

    // if there is a soruce then see if we meet the requirements (this is only weapon, explosive i havent figured out)
    if (charger.source === src.WEAPON) {
      const hasMatchingWeaponDamageType = weaponDamageTypes.includes(energyTypeToDamageType(subclassEnergy));

      if (hasMatchingWeaponDamageType) {
        generatedWellEnergies.push(subclassEnergy);
      }
      return {
        ...genSocket,
        isUsable: hasMatchingWeaponDamageType ? SocketUsable.YES : SocketUsable.NO,
        unusableReason: hasMatchingWeaponDamageType ? undefined : SocketUnusableReason.missingEnergyType,
      }
    }

    console.error("Well socket failed to match generator criteria", socket);
    return {
      ...genSocket,
      isUsable: SocketUsable.NO,
      unusableReason: SocketUnusableReason.unknown,
    };
  });

  return {
    wellGeneratorSockets: wellSockets,
    generatedWellEnergies,
  }
}

export const analyzeWellSpenderSockets = (
  sockets: AppSocketType[],
  subclassEnergy: DestinyEnergyType,
  wellEnergyTypes: DestinyEnergyType[]
): AppSocketType[] => {
  return filterWellSpenderSockets(sockets).map(socket => {
    const spendSocket = { ...socket, purpose: SocketPurpose.wellSpenderSockets };
    // If it's a mod that spends wells make sure it can
    const spender = spenders.find(s => s.hash === socket.definition.hash) as Spenders;
    if (!wellEnergyTypes.length) {
      return {
        ...spendSocket,
        isUsable: SocketUsable.MAYBE,
        unusableReason: SocketUnusableReason.missingWellGenerator,
      };
    }
    // check if we need to match the subclass and if we have any wells that are generated for that class
    if (spender.matchSubclass) {
      const hasMatchingSubclass = wellEnergyTypes.includes(subclassEnergy);
      return {
        ...spendSocket,
        isUsable: hasMatchingSubclass ? SocketUsable.YES : SocketUsable.NO,
        unusableReason: hasMatchingSubclass ? undefined : SocketUnusableReason.wrongSubclass,
      }
    }

    // if the mod depends on a specific energy then make sure we can make it
    if (spender.energy) {
      const hasMatchingWell = wellEnergyTypes.includes(spender.energy);
      return {
        ...spendSocket,
        isUsable: hasMatchingWell ? SocketUsable.YES : SocketUsable.MAYBE,
        unusableReason: hasMatchingWell ? undefined : SocketUnusableReason.missingWellEnergyType,
      }
    }

    console.error("Well socket failed to match spender criteria", socket);
    return {
      ...spendSocket,
      isUsable: SocketUsable.NO,
      unusableReason: SocketUnusableReason.unknown,
    };
  });
}
