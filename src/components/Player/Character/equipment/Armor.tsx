import { AppArmorType } from "core";
import Item from "./Item";
import Socket from "./Socket/Socket";
import Sockets from "./Sockets";

interface Props {
  armor: AppArmorType;
  detailMode?: boolean;
}

const Armor = ({ armor, detailMode = false }: Props) => {
  // console.log("Armor", armor);

  // if there's an ornament use that instead.
  const displayProperties = armor.armorSockets.ornament ? armor.armorSockets.ornament.definition.displayProperties :
                                                          armor.definition.displayProperties;

  const itemVersion = armor.item.versionNumber ? armor.item.versionNumber : 0;
  const watermarkIcon = armor.definition?.quality?.displayVersionWatermarkIcons[itemVersion];

  return (
    <Item
      icon={displayProperties}
      energyIcon={armor.energyType.displayProperties}
      name={armor.definition.displayProperties.name}
      type={armor.definition.itemTypeDisplayName}
      level={armor.instance?.primaryStat.value}
      watermarkIcon={watermarkIcon}
      showEnergyIcon
      detailMode={detailMode}
    >
      {armor.armorSockets.intrinsic && <Socket socket={armor.armorSockets.intrinsic} full={true} />}
      <Sockets sockets={armor.armorSockets.mods} />
    </Item>
  );
}

export default Armor;
