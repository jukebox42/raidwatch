import { Heading, HStack, VStack } from "@chakra-ui/react";
import intersection from "lodash/intersection";
import { DestinyEquippingBlockDefinition } from "bungie-api-ts/destiny2";

import { AppWeaponType, AppArmorType, AppSubclassType } from "core";
import Weapon from "../equipment/Weapon";
import Armor from "../equipment/Armor";
import Subclass from "./Subclass";
import { diffHashes } from "utils/common";



interface Props {
  weapons: AppWeaponType[];
  armors: AppArmorType[];
  subclass: AppSubclassType;
  detailMode?: boolean;
}

const Items = ({ weapons, armors, subclass, detailMode = false }: Props) => {
  //                      Kinetic,    Energy,     Power
  const equipmentSlots = [1498876634, 2465295065, 953998645];
  const weaponDisplay = weapons
    .sort((a, b) => {
      const aId = (a.definition.equippingBlock as DestinyEquippingBlockDefinition).equipmentSlotTypeHash;
      const bId = (b.definition.equippingBlock as DestinyEquippingBlockDefinition).equipmentSlotTypeHash;
      return (
        equipmentSlots.findIndex(e => diffHashes(e, aId)) <
        equipmentSlots.findIndex(e => diffHashes(e, bId)) ?
        -1 : 1
      );
    })
    .map(weapon => (<Weapon key={weapon.item.itemInstanceId} weapon={weapon} detailMode={detailMode} />));

  if (detailMode) {
    const armorTraits = ["armor_type.head", "armor_type.arms", "armor_type.chest", "armor_type.legs", "armor_type.class"];
    const armorDisplay = armors.sort((a, b) => {
      const aTraits = intersection(a.definition.traitIds);
      const aTraitPosition = aTraits.length > 0 ? armorTraits.findIndex(t => t === aTraits[0]) : -1;
      const bTraits = intersection(b.definition.traitIds);
      const bTraitPosition = bTraits.length > 0 ? armorTraits.findIndex(t => t === bTraits[0]) : -1;
      return aTraitPosition < bTraitPosition ? -1 : 1;
    }).map(armor => (<Armor key={armor.item.itemInstanceId} armor={armor} subclassDamageType={subclass.damageType} detailMode />));

    return (
      <>
        <Heading size="md" mb={1} mt={2}>Subclass</Heading>
        <Subclass subclass={subclass} detailMode={detailMode} />
        <Heading size="md" mb={1} mt={2}>Weapons</Heading>
        <VStack spacing={1} align="stretch">
          {weaponDisplay}
        </VStack>
        <Heading size="md" mb={1} mt={2}>Armor</Heading>
        <VStack spacing={1} align="stretch">
          {armorDisplay}
        </VStack>
      </>
    );
  }

  const exoticArmor = armors.find(a => a.definition.equippingBlock?.uniqueLabel === "exotic_armor");

  return (
    <>
      <HStack spacing={1}>
        <Subclass subclass={subclass} />
        {weaponDisplay}
        {exoticArmor && <Armor key={exoticArmor.item.itemInstanceId} armor={exoticArmor} subclassDamageType={subclass.damageType} />}
      </HStack>
    </>
  );
}

export default Items;
