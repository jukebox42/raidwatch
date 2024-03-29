import { DamageType } from "bungie-api-ts/destiny2";

import { AppArmorType } from "core";
import Item from "./Item";
import Socket from "./Socket/Socket";
import Sockets from "./Sockets";

interface Props {
  armor: AppArmorType;
  subclassDamageType: DamageType;
  detailMode?: boolean;
}

const Armor = ({ armor, subclassDamageType, detailMode = false }: Props) => {
  // console.log("Armor", armor.definition.displayProperties.name, armor);
  // armor.armorSockets.mods.forEach(s => console.log(s.definition.displayProperties.name, s.definition.hash, s));

  // if there's an ornament use that instead.
  const displayProperties = armor.armorSockets.ornament ? armor.armorSockets.ornament.definition.displayProperties :
                                                          armor.definition.displayProperties;

  const itemVersion = armor.item.versionNumber ? armor.item.versionNumber : 0;
  const watermarkIcon = armor.definition?.quality?.displayVersionWatermarkIcons[itemVersion];

  return (
    <Item
      icon={displayProperties}
      name={armor.definition.displayProperties.name}
      type={armor.definition.itemTypeDisplayName}
      level={armor.instance?.primaryStat.value}
      watermarkIcon={watermarkIcon}
      showEnergyIcon
      detailMode={detailMode}
    >
      {armor.armorSockets.intrinsic && <Socket socket={armor.armorSockets.intrinsic} full={true} />}
      <Sockets sockets={armor.armorSockets.mods} subclassDamageType={subclassDamageType} />
    </Item>
  );
}

export default Armor;
