import { DestinyBreakerType, DestinyItemSubType } from "bungie-api-ts/destiny2";

export const PIERCING_HASH = 485622768;
export const OVERLOAD_HASH = 2611060930;
export const UNSTOPPABLE_HASH = 3178805705;

export const breakerTypeToHash = (type: DestinyBreakerType) => {
  if(type === DestinyBreakerType.Disruption) {
    return OVERLOAD_HASH;
  }
  if (type === DestinyBreakerType.Stagger) {
    return UNSTOPPABLE_HASH;
  }
  if (type === DestinyBreakerType.ShieldPiercing) {
    return PIERCING_HASH;
  }
  return 0;
}

// TODO: find a better place for this. Maybe a Maps file?
export const weaponMap = [
  { trait: "weapon_type.auto_rifle", name: "Auto Rifle", type: DestinyItemSubType.AutoRifle },
  { trait: "weapon_type.bow", name: "Bow", type: DestinyItemSubType.Bow },
  { trait: "weapon_type.fusion_rifle", name: "Fusion Rifle", type: DestinyItemSubType.FusionRifle },
  { trait: "weapon_type.glaive", name: "Glaive", type: DestinyItemSubType.Glaive },
  { trait: "weapon_type.grenade_launcher", name: "Grenade Launcher", type: DestinyItemSubType.GrenadeLauncher },
  { trait: "weapon_type.hand_cannon", name: "Hand Cannon", type: DestinyItemSubType.HandCannon },
  { trait: "weapon_type.linear_fusion_rifle", name: "Linear Fusion Rifle", type: DestinyItemSubType.FusionRifleLine },
  { trait: "weapon_type.machine_gun", name: "Machine Gun", type: DestinyItemSubType.Machinegun },
  { trait: "weapon_type.pulse_rifle", name: "Pulse Rifle", type: DestinyItemSubType.PulseRifle },
  { trait: "weapon_type.rocket_launcher", name: "Rocket Launcher", type: DestinyItemSubType.RocketLauncher },
  { trait: "weapon_type.scout_rifle", name: "Scout Rifle", type: DestinyItemSubType.ScoutRifle },
  { trait: "weapon_type.shotgun", name: "Shotgun", type: DestinyItemSubType.Shotgun },
  { trait: "weapon_type.sidearm", name: "Sidearm", type: DestinyItemSubType.Sidearm },
  { trait: "weapon_type.sniper_rifle", name: "Sniper Rifle", type: DestinyItemSubType.SniperRifle },
  { trait: "weapon_type.sword", name: "Sword", type: DestinyItemSubType.Sword },
  { trait: "weapon_type.submachinegun", name: "Submachine Gun", type: DestinyItemSubType.SubmachineGun },
  { trait: "weapon_type.trace_rifle", name: "Trace Rifle", type: DestinyItemSubType.TraceRifle },
];
