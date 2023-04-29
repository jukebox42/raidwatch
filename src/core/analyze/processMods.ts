import { DamageType, DestinyAmmunitionType } from "bungie-api-ts/destiny2";
import intersection from "lodash/intersection";

import { AppSocketType, SocketUsable } from "core/sockets";
import { AnalyzeModType, analyzeMods } from "./mods";
import { diffHashes } from "utils/common";
import { SocketPurpose, SocketUnusableReason } from "./enums";

export type ImportantSockets = {
  ammoFinder: AppSocketType[],
  ammoScout: AppSocketType[],
  weaponDamageType: AppSocketType[],
  raid: AppSocketType[],
};

/**
 * Validate if the provided socket can be used based on the damage types provided.
 */
const hasWeaponRequirements = (
  damageTypes: DamageType[],
  weaponDamageTypes: DamageType[],
  subclassDamageType: DamageType,
  mustMatchSubclass?: boolean
) => {
  if (mustMatchSubclass && weaponDamageTypes.includes(subclassDamageType)) {
    return true;
  }
  return intersection(weaponDamageTypes, damageTypes).length > 0;
}

/**
 * Validate if the provided socket is a raid mod and is not empty.
 */
export const isRaidSocket = (socket: AppSocketType) => {
  return socket.definition.displayProperties && socket.definition.plug &&
         /enhancements.raid/.test(socket.definition.plug.plugCategoryIdentifier) &&
         socket.definition.displayProperties.name !== "Empty Mod Socket";
}

/**
 * Process mods and return the ones that we care about.
 */
export const processMods = (
  sockets: AppSocketType[],
  weaponDamageTypes: DamageType[],
  weaponAmmoTypes: DestinyAmmunitionType[],
  subclassDamageType: DamageType
) => {
  const mods: ImportantSockets = {
    ammoFinder: [],
    ammoScout: [],
    weaponDamageType: [],
    raid: [],
  };

  sockets.forEach(socket => {
    // Process raid mods, we don't keep a stash of these, we check by identifier
    if (isRaidSocket(socket)) {
      return mods.raid.push({
        ...socket,
        purpose: SocketPurpose.raidSockets,
        isUsable: SocketUsable.YES,
      });
    }

    // TODO: Maybe we add support for showing broken mods from Bungie? Might be tough to keep up

    // TODO: Maybe show mods you can't stack? Do these exist anymore?

    // Check if the mod is one we care about, if not return.
    const analyzeMod = analyzeMods.find(m => diffHashes(m.hash, socket.definition.hash));
    if (!analyzeMod) {
      return;
    }

    // Process ammo finder mods
    if (analyzeMod.type === AnalyzeModType.AmmoFinder) {
      const isUsable = weaponAmmoTypes.includes(analyzeMod.ammoType);
      // Only return broken mods, otherwise this would be a long list.
      if (isUsable) {
        return;
      }
      return mods.ammoFinder.push({
        ...socket,
        purpose: SocketPurpose.ammoFinderSockets,
        isUsable: SocketUsable.NO,
        unusableReason: SocketUnusableReason.missingWeapon,
      });
    }

    // Process ammo scout mods (always show because they support other players)
    if (analyzeMod.type === AnalyzeModType.AmmoScout) {
      return mods.ammoScout.push({
        ...socket,
        purpose: SocketPurpose.ammoScoutSockets,
        isUsable: SocketUsable.YES,
        unusableReason: undefined,
      });
    }

    // Process weapon damage mods
    if (analyzeMod.type === AnalyzeModType.WeaponDamageType) {
      const isUsable = hasWeaponRequirements(
        analyzeMod.damageTypes,
        weaponDamageTypes,
        subclassDamageType,
        analyzeMod.mustMatchSubclass);
      // Only return broken mods, otherwise this would be a long list.
      if (isUsable) {
        return;
      }
      return mods.weaponDamageType.push({
        ...socket,
        purpose: SocketPurpose.damageTypeSockets,
        isUsable: SocketUsable.NO,
        unusableReason: SocketUnusableReason.missingDamageType,
      });
    }
  });

  return mods;
};
