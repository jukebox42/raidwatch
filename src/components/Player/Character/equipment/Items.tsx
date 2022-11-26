import { Divider, Heading, HStack, VStack } from "@chakra-ui/react";

import { AppWeaponType, AppArmorType, AppSubclassType } from "core";
import Weapon from "../equipment/Weapon";
import Armor from "../equipment/Armor";
import Subclass from "./Subclass";
import { PADDING } from "context/theme";

interface Props {
  weapons: AppWeaponType[];
  armors: AppArmorType[];
  subclass: AppSubclassType;
  detailMode: boolean;
}

const Items = ({ weapons, armors, subclass, detailMode }: Props) => {
  const exoticArmor = armors.find(a => a.definition.equippingBlock?.uniqueLabel === "exotic_armor");

  if (detailMode) {
    return (
      <>
        <Divider mt={2} mb={2} />
        <Heading size="md" mb={PADDING}>Subclass</Heading>
        <Subclass subclass={subclass} detailMode={detailMode} />
        <Heading size="md" mb={PADDING}>Weapons</Heading>
        <VStack spacing={PADDING} align="stretch">
          {weapons.map(weapon => (<Weapon key={weapon.item.itemInstanceId} weapon={weapon} detailMode />))}
        </VStack>
        <Heading size="md" mb={PADDING}>Armor</Heading>
        <VStack spacing={PADDING} align="stretch">
          {armors.map(armor => (<Armor key={armor.item.itemInstanceId} armor={armor} detailMode />))}
        </VStack>
      </>
    );
  }

  return (
    <>
      <HStack spacing={PADDING}>
        <Subclass subclass={subclass} />
        {weapons.map(weapon => (<Weapon key={weapon.item.itemInstanceId} weapon={weapon} />))}
        {exoticArmor && <Armor key={exoticArmor.item.itemInstanceId} armor={exoticArmor} />}
      </HStack>
    </>
  );
}

export default Items;
