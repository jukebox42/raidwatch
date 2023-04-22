import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
  DestinyItemComponent,
  DestinyItemInstanceComponent,
  DestinyItemSocketBlockDefinition,
  DestinyItemSocketState,
  DestinyProfileResponse,
  DestinySandboxPerkDefinition,
  DestinyStatDefinition,
} from "bungie-api-ts/destiny2";
import { diffHashes } from "utils/common";
import { SocketPurpose, SocketUnusableReason } from "./analyze/enums";

import { getEnergyCostDefinition, getItemDefinitions, getPerkDefinitions } from "./common";

export enum SocketUsable {
  NO = 0,
  YES,
  MAYBE
}

export type AppSocketType = {
  socket: DestinyItemSocketState,
  instance: DestinyItemInstanceComponent,
  definition: DestinyInventoryItemDefinition,
  perksDefinition: DestinySandboxPerkDefinition[],
  energyCostDefinition?: DestinyStatDefinition,
  isUsable?: SocketUsable,
  unusableReason?: SocketUnusableReason,
  purpose?: SocketPurpose,
}

export type AppWeaponSocketsType = {
  isExotic: boolean,
  intrinsic?: AppSocketType, // aka exotic or frame on non exotics
  perks: AppSocketType[],
  mod?: AppSocketType,
  masterwork?: AppSocketType, // on non exotics
  catalyst?: AppSocketType, // only on exotics
  shader?: AppSocketType, // on non exotics
  ornament?: AppSocketType, // on exotics and _some_ non exotics
}

export type AppArmorSocketsType = {
  mods: AppSocketType[],
  shader?: AppSocketType,
  ornament?: AppSocketType,
  intrinsic?: AppSocketType, // exotic
};

export type AppSubclassSocketsType = {
  super: AppSocketType,
  movement: AppSocketType,
  ability: AppSocketType,
  melee: AppSocketType,
  grenade: AppSocketType,
  fragments: AppSocketType[],
  aspects: AppSocketType[],
}

const masterworkIdentifiers = [
  "v400.plugs.weapons.masterworks.trackers",
  "v400.plugs.weapons.masterworks.stat.stability",
  "v400.plugs.weapons.masterworks.stat.range",
  "v400.plugs.weapons.masterworks.stat.impact",
  "v400.plugs.weapons.masterworks.stat.handling",
  "v400.plugs.weapons.masterworks.stat.reload",
  "v400.plugs.weapons.masterworks.stat.magazine",
  "v400.plugs.weapons.masterworks.stat.blast_radius",
  "v400.plugs.weapons.masterworks.stat.velocity",
];

type GetSocketsType = (
  profile: DestinyProfileResponse,
  item: DestinyItemComponent,
  manifest: AllDestinyManifestComponents,
) => AppSocketType[]

export const getSockets: GetSocketsType = (profile, item, manifest) => {
  if (
    !profile?.itemComponents?.sockets?.data ||
    !profile?.itemComponents?.instances?.data ||
    !item.itemInstanceId
  ) {
    console.log("getSockets No Sockets");
    return [];
  }
  const itemInstanceId = item.itemInstanceId;
  const socketsData = profile.itemComponents.sockets.data[itemInstanceId];
  if (!socketsData) {
    return [];
  }
  const instance = profile.itemComponents.instances.data[itemInstanceId];
  return socketsData.sockets.filter(s => s.plugHash && s.isVisible).map(socket => {
    if (!socket.plugHash) {
      throw new Error("Somehow failed to find hash...");
    }
    const definition = getItemDefinitions([socket.plugHash.toString()], manifest)[0];
    const perkKeys = definition.perks.map(p => p.perkHash.toString());
    const energyCostDefinition = getEnergyCostDefinition(
      definition.plug?.energyCost?.energyTypeHash.toString(),
      manifest);
    return {
      socket,
      instance,
      definition,
      energyCostDefinition,
      perksDefinition: perkKeys.length ?  getPerkDefinitions(perkKeys, manifest) : [],
    }
  });
}

const WEAPON_PERKS_HASH = 4241085061;
const INTRINSIC_TRAITS_HASH = 3956125808;
const WEAPON_MODS_HASH = 2685412949;
//                    kill tracker, momento
const FILTER_PERKS = [4181669225, 2947756142];
export const getWeaponSockets = (sockets: AppSocketType[], definition: DestinyInventoryItemDefinition): AppWeaponSocketsType => {
  const socketCategories = (definition.sockets as DestinyItemSocketBlockDefinition).socketCategories;
  // perks
  let perks: AppSocketType[] = [];
  const weaponPerkIndexes = socketCategories.find(c => diffHashes(c.socketCategoryHash, WEAPON_PERKS_HASH));
  if (weaponPerkIndexes) {
    perks = weaponPerkIndexes
      .socketIndexes.map(i => sockets[i])
      .filter(p => p?.definition?.plug && !FILTER_PERKS.includes(p.definition.plug.plugCategoryHash));
  }
  // intrinsic
  let intrinsic: AppSocketType | undefined;
  const intrinsicTraitIndexes = socketCategories.find(c => diffHashes(c.socketCategoryHash, INTRINSIC_TRAITS_HASH));
  if (intrinsicTraitIndexes) {
    intrinsic = sockets[intrinsicTraitIndexes.socketIndexes[0]];
  }
  // mod
  let mod: AppSocketType | undefined;
  const weaponModIndexes = socketCategories.find(c => diffHashes(c.socketCategoryHash, WEAPON_MODS_HASH));
  if (weaponModIndexes) {
    mod = sockets[weaponModIndexes.socketIndexes[0]];
  }

  const shader = sockets.find(s => s.definition.plug?.plugCategoryIdentifier === "shader");
  const catalyst = sockets.find(s => {
    if (s.definition.plug?.plugCategoryIdentifier === "v400.empty.exotic.masterwork") {
      return true;
    }
    return s.definition.traitIds?.includes("item_type.exotic_catalyst");
  });
  const masterwork = sockets.find(s => {
    if (!s.definition.plug) {
      return false;
    }
    return masterworkIdentifiers.includes(s.definition.plug.plugCategoryIdentifier);
  });
  const ornament = sockets.find(s => s.definition.traitIds?.includes("item_type.ornament.weapon"));

  return {
    isExotic: !!catalyst,
    intrinsic,
    perks,
    mod,
    masterwork,
    catalyst,
    shader,
    ornament,
  };
}

export const getArmorSockets = (sockets: AppSocketType[]): AppArmorSocketsType => {
  const ornament = sockets.find(s => {
    return s.definition.itemTypeAndTierDisplayName === "Legendary Chest Armor" ||
           (s.definition.traitIds?.includes("item_type.ornament.armor"))
  });
  const shader = sockets.find(s => s.definition.itemTypeDisplayName === "Shader");
  const intrinsic = sockets.find(s => s.definition.itemTypeAndTierDisplayName === "Exotic Intrinsic");
  const banList = [ornament, shader, intrinsic];
  const mods = sockets.filter(s => {
    // Get rid of legendary skins
    if (s.definition.itemTypeAndTierDisplayName === "Legendary Intrinsic") {
      return false;
    }
    // Energy is used in another spot, upgrade is useless to us and we dont care about empty sockets
    if (["Change Energy Type", "Upgrade Armor", "Empty Mod Socket"].includes(s.definition.displayProperties.name)) {
      return false;
    }
    // Get rid of skins
    if (s.definition.plug && /^armor_skins/.test(s.definition.plug.plugCategoryIdentifier)) {
      return false;
    }
    return !banList.find(s2 => diffHashes(s2?.definition.hash, s.definition.hash));
  });

  return {
    mods,
    shader,
    ornament,
    intrinsic,
  };
}

const socketMatch = (sockets: AppSocketType[], regex: RegExp) => {
  return sockets.find(s => s.definition.plug && regex.test(s.definition.plug.plugCategoryIdentifier));
}

export const getSubclassSockets = (sockets: AppSocketType[]): AppSubclassSocketsType => {
  const superAbility = socketMatch(sockets, /\.supers$/);
  const ability = socketMatch(sockets, /\.class_abilities$/);
  const movement = socketMatch(sockets, /\.movement$/);
  const melee = socketMatch(sockets, /\.melee$/);
  const grenade = socketMatch(sockets, /\.grenades$/);
  const fragments = sockets.filter(s => s.definition.traitIds && s.definition.traitIds.includes("item_type.aspect"));
  const aspects = sockets.filter(s => s.definition.traitIds && s.definition.traitIds.includes("item_type.fragment"));
  
  if (!superAbility || !ability || !movement || !melee || !grenade) {
    console.error("Missing", superAbility, ability, movement, melee, grenade);
    throw new Error("Unknown error, missing something important. Consult console.error");
  }
  
  return {
    super: superAbility,
    ability,
    movement,
    melee,
    grenade,
    fragments,
    aspects,
  }
}
