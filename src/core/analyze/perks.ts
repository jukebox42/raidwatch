import { DestinyBreakerType, DestinyItemSubType } from "bungie-api-ts/destiny2";

export type AnalyzeBreakerPerkType = {
  hash: number,
  breakerType: DestinyBreakerType,
  weapons: DestinyItemSubType[],
}

export const breakerPerks = [
  // Tier 1
  // Anti-Barrier Pulse Rifle
  { hash: 433122833, breakerType: DestinyBreakerType.ShieldPiercing, weapons: [DestinyItemSubType.PulseRifle] },
  // Piercing Sidearms
  { hash: 433122834, breakerType: DestinyBreakerType.ShieldPiercing, weapons: [DestinyItemSubType.Sidearm] },
  // Overload Bow
  { hash: 433122835, breakerType: DestinyBreakerType.Disruption, weapons: [DestinyItemSubType.Bow] },
  // Unstoppable Scout Rifle
  { hash: 433122836, breakerType: DestinyBreakerType.Stagger, weapons: [DestinyItemSubType.ScoutRifle] },
  // Overloaded Auto/SMG
  { hash: 433122837, breakerType: DestinyBreakerType.Disruption, weapons: [DestinyItemSubType.AutoRifle, DestinyItemSubType.SubmachineGun] },
  // Tier 5
  // Medival Champion
  { hash: 3257939736, breakerType: DestinyBreakerType.Stagger, weapons: [DestinyItemSubType.Glaive] },
];
