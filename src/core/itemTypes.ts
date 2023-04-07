import {
  DestinyArtifactTierItem,
  DestinyBreakerTypeDefinition,
  DestinyDamageTypeDefinition,
  DestinyEnergyTypeDefinition,
  DestinyInventoryItemDefinition,
  DestinyItemComponent,
  DestinyItemInstanceComponent,
} from "bungie-api-ts/destiny2";

import {
  AppArmorSocketsType,
  AppSocketType,
  AppSubclassSocketsType,
  AppWeaponSocketsType,
} from "./sockets";

export const ITEM_TYPES = {
  WEAPON: "item_type.weapon",
  ARMOR: "item_type.armor",
  SUBCLASS: {
    LIGHT: "item_type.light_subclass",
    DARK: "item_type.dark_subclass"
  }
};

export type AppWeaponType = {
  item: DestinyItemComponent,
  instance?: DestinyItemInstanceComponent,
  damageType: DestinyDamageTypeDefinition,
  definition: DestinyInventoryItemDefinition,
  sockets: AppSocketType[],
  weaponSockets: AppWeaponSocketsType,
};

export type AppArmorType = {
  item: DestinyItemComponent,
  instance?: DestinyItemInstanceComponent,
  energyType: DestinyEnergyTypeDefinition,
  definition: DestinyInventoryItemDefinition,
  sockets: AppSocketType[],
  armorSockets: AppArmorSocketsType,
};

export type AppArtifactType = {
  item: DestinyArtifactTierItem,
  definition: DestinyInventoryItemDefinition,
};

export type AppSubclassType = {
  item: DestinyItemComponent,
  instance?: DestinyItemInstanceComponent,
  definition: DestinyInventoryItemDefinition,
  sockets: AppSocketType[],
  subclassSockets: AppSubclassSocketsType,
};

export type AppGenericEquipmentType = {
  item: DestinyItemComponent,
  instance?: DestinyItemInstanceComponent,
  definition: DestinyInventoryItemDefinition,
  sockets: AppSocketType[],
};

export type AppBreakerType = {
  hash: string,
  definition: DestinyBreakerTypeDefinition,
  sourceNames: string[],
}

export type AppEquipmentType = AppWeaponType | AppArmorType | AppSubclassType | AppGenericEquipmentType;
