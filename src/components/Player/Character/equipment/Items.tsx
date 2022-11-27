import { Divider, Heading, HStack, VStack } from "@chakra-ui/react";
import intersection from "lodash/intersection";

import { AppWeaponType, AppArmorType, AppSubclassType } from "core";
import Weapon from "../equipment/Weapon";
import Armor from "../equipment/Armor";
import Subclass from "./Subclass";
import { PADDING } from "context/theme";
import { DestinyEquippingBlockDefinition } from "bungie-api-ts/destiny2";


interface Props {
  weapons: AppWeaponType[];
  armors: AppArmorType[];
  subclass: AppSubclassType;
  detailMode?: boolean;
}

const Items = ({ weapons, armors, subclass, detailMode = false }: Props) => {
  const weaponDisplay = weapons
    .sort((a, b) => {
      return (
        (a.definition.equippingBlock as DestinyEquippingBlockDefinition).ammoType <
        (b.definition.equippingBlock as DestinyEquippingBlockDefinition).ammoType ?
        -1 : 1
      );
    })
    .map(weapon => (<Weapon key={weapon.item.itemInstanceId} weapon={weapon} detailMode={detailMode} />));

  if (detailMode) {
    // TODO: There has to be a better way to sort these. There has to...
    const armorTraits = ["armor_type.head", "armor_type.arms", "armor_type.chest", "armor_type.legs", "armor_type.class"];
    const armorDisplay = armors.sort((a, b) => {
      const aTraits = intersection(a.definition.traitIds);
      const aTraitPosition = aTraits.length > 0 ? armorTraits.findIndex(t => t === aTraits[0]) : -1;
      const bTraits = intersection(b.definition.traitIds);
      const bTraitPosition = bTraits.length > 0 ? armorTraits.findIndex(t => t === bTraits[0]) : -1;
      return aTraitPosition < bTraitPosition ? -1 : 1;
    }).map(armor => (<Armor key={armor.item.itemInstanceId} armor={armor} detailMode />));

    return (
      <>
        <Divider mt={2} mb={2} />
        <Heading size="md" mb={PADDING}>Subclass</Heading>
        <Subclass subclass={subclass} detailMode={detailMode} />
        <Heading size="md" mb={PADDING}>Weapons</Heading>
        <VStack spacing={PADDING} align="stretch">
          {weaponDisplay}
        </VStack>
        <Heading size="md" mb={PADDING}>Armor</Heading>
        <VStack spacing={PADDING} align="stretch">
          {armorDisplay}
        </VStack>
      </>
    );
  }

  const exoticArmor = armors.find(a => a.definition.equippingBlock?.uniqueLabel === "exotic_armor");

  return (
    <>
      <HStack spacing={PADDING}>
        <Subclass subclass={subclass} />
        {weaponDisplay}
        {exoticArmor && <Armor key={exoticArmor.item.itemInstanceId} armor={exoticArmor} />}
      </HStack>
    </>
  );
}

export default Items;
