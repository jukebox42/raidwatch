import { DamageType, DestinyBreakerType, DestinyItemSubType } from "bungie-api-ts/destiny2";

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

export const breakerTraits = [
  // Radiant
  { hash: 1973222647, breakerType: DestinyBreakerType.ShieldPiercing },
  // Ignition
  { hash: 2127908492, breakerType: DestinyBreakerType.Stagger },
  // Blind
  { hash: 1679107659, breakerType: DestinyBreakerType.Stagger },
  // Jolted
  { hash: 2228690371, breakerType: DestinyBreakerType.Disruption },
  // Volatile rounds
  { hash: 2650036230, breakerType: DestinyBreakerType.ShieldPiercing, weaponDamageType: DamageType.Void },
  // Suppression
  { hash: 3172172883, breakerType: DestinyBreakerType.Disruption },
  // Slow
  { hash: 4135386068, breakerType: DestinyBreakerType.Disruption },
  // Shatter
  { hash: 4272830254, breakerType: DestinyBreakerType.Stagger },
  // Suspend
  { hash: 3271908156, breakerType: DestinyBreakerType.Stagger },
  // Unraveling rounds
  { hash: 622080519, breakerType: DestinyBreakerType.ShieldPiercing, weaponDamageType: DamageType.Strand },
];

// TODO: find a better place for this. Maybe a Maps file?
export const weaponMap = [
  { trait: "weapon_type.auto_rifle", type: DestinyItemSubType.AutoRifle },
  { trait: "weapon_type.bow", type: DestinyItemSubType.Bow },
  { trait: "weapon_type.fusion_rifle", type: DestinyItemSubType.FusionRifle },
  { trait: "weapon_type.glaive", type: DestinyItemSubType.Glaive },
  { trait: "weapon_type.grenade_launcher", type: DestinyItemSubType.GrenadeLauncher },
  { trait: "weapon_type.hand_cannon", type: DestinyItemSubType.HandCannon },
  { trait: "weapon_type.linear_fusion_rifle", type: DestinyItemSubType.FusionRifleLine },
  { trait: "weapon_type.machine_gun", type: DestinyItemSubType.Machinegun },
  { trait: "weapon_type.pulse_rifle", type: DestinyItemSubType.PulseRifle },
  { trait: "weapon_type.rocket_launcher", type: DestinyItemSubType.RocketLauncher },
  { trait: "weapon_type.scout_rifle", type: DestinyItemSubType.ScoutRifle },
  { trait: "weapon_type.shotgun", type: DestinyItemSubType.Shotgun },
  { trait: "weapon_type.sidearm", type: DestinyItemSubType.Sidearm },
  { trait: "weapon_type.sniper_rifle", type: DestinyItemSubType.SniperRifle },
  { trait: "weapon_type.sword", type: DestinyItemSubType.Sword },
  { trait: "weapon_type.submachinegun", type: DestinyItemSubType.SubmachineGun },
  { trait: "weapon_type.trace_rifle", type: DestinyItemSubType.TraceRifle },
];
