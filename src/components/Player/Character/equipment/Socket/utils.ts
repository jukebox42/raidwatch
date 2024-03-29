import { SocketUnusableReason } from "core/analyze/enums";
import { SocketUsable } from "core/sockets";

const getAlertText = (unusableReason: SocketUnusableReason | undefined) => {
  if (unusableReason === undefined) {
    return "";
  }
  switch (unusableReason) {
    case SocketUnusableReason.missingWeapon:
      return "Must equip a matching weapon for this mod to activate.";
    case SocketUnusableReason.missingEnergyType:
      return "Must equip a weapon or subclass with a matching energy type for this mod to activate.";
      case SocketUnusableReason.missingDamageType:
        return "Must equip a weapon with a matching damage type for this mod to activate.";
    case SocketUnusableReason.wrongSubclass:
      return "This mod requires a different subclass to activate.";
    case SocketUnusableReason.missingChampionBreaker:
      return "Must have a working champion mod. This mod may still work if your allies can stun champions."
    case SocketUnusableReason.unsupported:
    case SocketUnusableReason.unknown:
    default:
      return "RaidWatch cannot detect if this mod is working.";
  }
}

type GetAlertDetails = (
  isUsable?: SocketUsable,
  unusableReason?: SocketUnusableReason
) => {
  cross: any,
  alertType: "success" | "warning" | "error",
  socketStyle: string,
  alertText: string,
}

export const getAlertDetails: GetAlertDetails =  (isUsable, unusableReason) => {
  if (isUsable === undefined || isUsable === SocketUsable.YES) {
    return {
      cross: {},
      alertType: "success",
      alertText: "",
      socketStyle: "socket",
    };
  }

  const alertText = getAlertText(unusableReason);
  let cross = {
    position: "absolute",
    content: "''",
    left: 0,
    top: "49%",
    right: 0,
    borderTop: "2px solid",
    transform: "rotate(-45deg)",
    borderColor: "brand.350",
  };

  // Error
  if (isUsable === SocketUsable.NO) {
    return {
      cross,
      alertType: "error",
      alertText,
      socketStyle: "socketError",
    }
  }

  // Warning
  return {
    cross: { ...cross, borderColor: "brand.375" },
    alertType: "warning",
    alertText,
    socketStyle: "socketWarning",
  }
}
