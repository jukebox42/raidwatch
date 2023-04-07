import {
  AllDestinyManifestComponents,
  DestinyItemType,
  DestinyProfileResponse
} from "bungie-api-ts/destiny2";

import { AppEquipmentType, AppSubclassType, ITEM_TYPES } from "./itemTypes";

import {
  getArmorSockets,
  getSockets,
  getSubclassSockets,
  getWeaponSockets,
} from "./sockets";

type GetEquipmentType = (
  profile: DestinyProfileResponse,
  characterId: string,
  manifest: AllDestinyManifestComponents,
) => AppEquipmentType[];

export const getEquipment: GetEquipmentType = (profile, characterId, manifest)=> {
  if (
    !profile?.characterEquipment?.data  ||
    !profile.characterEquipment.data[characterId] ||
    !profile.itemComponents.instances.data
  ) {
    console.log("getEquipment No Equipment");
    return [];
  }

  const equipment = profile.characterEquipment.data[characterId].items;
  const equipmentKeys = equipment.map(e => e.itemHash.toString());
  const instances = profile.itemComponents.instances.data;

  return Object.keys(manifest.DestinyInventoryItemDefinition)
    .filter(key => equipmentKeys.includes(key.toString()))
    .map(key => {
      const item = equipment.find(e => e.itemHash.toString() === key);
      if (!item) {
        throw new Error("Somehow didnt find item...");
      }

      const instance = item.itemInstanceId ? instances[item.itemInstanceId] : undefined;
      const definition = manifest.DestinyInventoryItemDefinition[key];
      const sockets = getSockets(profile, item, manifest);

      const tempItem = {
        item,
        instance,
        definition,
        sockets,
      };

      // Subclass
      if (instance && instance.energy && equipmentIsSubclass(tempItem)) {
        const subclassItem = {
          ...tempItem,
          subclassSockets: getSubclassSockets(sockets),
        };
        return subclassItem;
      }
      
      // TODO: Sort by DestinyAmmunitionType
      // https://bungie-net.github.io/multi/schema_Destiny-DestinyAmmunitionType.html#schema_Destiny-DestinyAmmunitionType
      // Weapons
      if (instance && instance.damageTypeHash) {
        return {
          ...tempItem,
          damageType: manifest.DestinyDamageTypeDefinition[instance.damageTypeHash],
          weaponSockets: getWeaponSockets(sockets, definition),
        };
      }

      // Armors
      if (instance && instance.energy) {
        return {
          ...tempItem,
          energyType: manifest.DestinyEnergyTypeDefinition[instance.energy.energyTypeHash],
          armorSockets: getArmorSockets(sockets),
        };
      }

      // Extra equipment like finishers, clan banner ect.
      // console.log("Extra Equipment", tempItem.definition.displayProperties.name, tempItem);
      return tempItem;
  });
}

export const filterEquipmentByTrait = (trait: string, equipment: AppEquipmentType[]): AppEquipmentType[] => {
  return equipment.filter(e => e.definition.traitIds && e.definition.traitIds.includes(trait));
}

export const filterEquipmentByItemType = (type: DestinyItemType, equipment: AppEquipmentType[]): AppEquipmentType[] => {
  return equipment.filter(e => e.definition.itemType === type);
}

export const filterEquipmentBySubclass = (equipment: AppEquipmentType[]): AppSubclassType => {
  const light = filterEquipmentByTrait(ITEM_TYPES.SUBCLASS.LIGHT, equipment);
  const subclasses = light.length ? light : filterEquipmentByTrait(ITEM_TYPES.SUBCLASS.DARK, equipment);

  const subclass = subclasses[0] as AppSubclassType;

  return {
    item: subclass.item,
    instance: subclass.instance,
    definition: subclass.definition,
    sockets: subclass.sockets,
    subclassSockets: subclass.subclassSockets,
  };
}

export const equipmentIsSubclass = (equipment: AppEquipmentType): boolean => {
  if (!equipment.definition.traitIds) {
    return false;
  }
  return equipment.definition.traitIds.includes(ITEM_TYPES.SUBCLASS.LIGHT) ||
         equipment.definition.traitIds.includes(ITEM_TYPES.SUBCLASS.DARK);
}
