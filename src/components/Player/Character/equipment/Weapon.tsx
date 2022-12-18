import { AppWeaponType } from "core";
import Item from "./Item";
import Socket from "./Socket/Socket";
import Sockets from "./Sockets";

interface Props {
  weapon: AppWeaponType;
  detailMode?: boolean;
}

const Weapon = ({ weapon, detailMode = false }: Props) => {
  console.log("Weapon", weapon.definition.displayProperties.name, weapon);

  // If there's an ornament use that instead.
  const displayProperties = weapon.weaponSockets.ornament ? weapon.weaponSockets.ornament.definition.displayProperties :
                            weapon.definition.displayProperties;

  // For exotic weapons we want the intrinsic perk on it's own. otherwise it's a frame so push it to the perk list.
  let exoticPerk = (<></>);
  const perks = [...weapon.weaponSockets.perks];
  if (weapon.weaponSockets.masterwork) {
    perks.push(weapon.weaponSockets.masterwork);
  }
  if (weapon.weaponSockets.intrinsic?.definition.itemTypeAndTierDisplayName === "Legendary Intrinsic") {
    perks.unshift(weapon.weaponSockets.intrinsic);
  } else if (weapon.weaponSockets.intrinsic) {
    exoticPerk = (<Socket socket={weapon.weaponSockets.intrinsic} full={true} />);
  }

  const itemVersion = weapon.item.versionNumber ? weapon.item.versionNumber : 0;
  const watermarkIcon = weapon.definition?.quality?.displayVersionWatermarkIcons[itemVersion];

  return (
    <Item
      icon={displayProperties}
      energyIcon={weapon.damageType.displayProperties}
      name={weapon.definition.displayProperties.name}
      type={weapon.definition.itemTypeDisplayName}
      level={weapon.instance?.primaryStat.value}
      watermarkIcon={watermarkIcon}
      showEnergyIcon
      detailMode={detailMode}
    >
      {weapon.weaponSockets.intrinsic && exoticPerk}
      {weapon.weaponSockets.catalyst && <Socket socket={weapon.weaponSockets.catalyst} full={true} />}
      <Sockets sockets={perks} />
    </Item>
  );
}

export default Weapon;
