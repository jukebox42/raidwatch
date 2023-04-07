import intersection from "lodash/intersection";
import { DamageType, DestinyBreakerType, DestinyItemSubType } from "bungie-api-ts/destiny2"

import { AppArtifactType } from "core/itemTypes";
import { breakerTypeToHash } from "./helpers"

type BreakerPerkTypes = {
  name: string,
  hash: number,
  breakerType: DestinyBreakerType,
  weapons: DestinyItemSubType[]
}

enum BreakerCondition {
  // Solar
  Radiant,
  Ignition,
  // Arc
  Blind,
  Jolt,
  // Void
  Volatile,
  Suppression,
  // Stasis
  Slow,
  Shatter,
  // Strand
  Suspend,
  Unraveling,
}

const breakerDamageRules = [
  { name: "Arc blind effects", damageType: DamageType.Arc, condition: BreakerCondition.Blind, breakerType: DestinyBreakerType.Stagger },
  { name: "Arc jolt effects", damageType: DamageType.Arc, condition: BreakerCondition.Jolt, breakerType: DestinyBreakerType.Disruption },
  { name: "Solar radiant effects", damageType: DamageType.Thermal, condition: BreakerCondition.Radiant, breakerType: DestinyBreakerType.ShieldPiercing },
  { name: "Solar ignition effects", damageType: DamageType.Thermal, condition: BreakerCondition.Ignition, breakerType: DestinyBreakerType.Stagger },
  { name: "Void volatile rounds", damageType: DamageType.Void, condition: BreakerCondition.Volatile, breakerType: DestinyBreakerType.ShieldPiercing },
  { name: "Void suppression effects", damageType: DamageType.Void, condition: BreakerCondition.Suppression, breakerType: DestinyBreakerType.Disruption },
  { name: "Stasis shatter effects", damageType: DamageType.Stasis, condition: BreakerCondition.Shatter, breakerType: DestinyBreakerType.Stagger },
  { name: "Stasis slow effects", damageType: DamageType.Stasis, condition: BreakerCondition.Slow, breakerType: DestinyBreakerType.Disruption },
  { name: "Strand unraveling rounds", damageType: DamageType.Strand, condition: BreakerCondition.Unraveling, breakerType: DestinyBreakerType.ShieldPiercing },
  { name: "Strand suspend effects", damageType: DamageType.Strand, condition: BreakerCondition.Suspend, breakerType: DestinyBreakerType.Stagger },
];

const breakerPerks: BreakerPerkTypes[] = [
  // Tier 1
  { name: "Anti-Barrier Pulse Rifle", hash: 433122833, breakerType: DestinyBreakerType.ShieldPiercing, weapons: [DestinyItemSubType.PulseRifle] },
  { name: "Piercing Sidearms", hash: 433122834, breakerType: DestinyBreakerType.ShieldPiercing, weapons: [DestinyItemSubType.Sidearm] },
  { name: "Overload Bow", hash: 433122835, breakerType: DestinyBreakerType.Disruption, weapons: [DestinyItemSubType.Bow] },
  { name: "Unstoppable Scout Rifle", hash: 433122836, breakerType: DestinyBreakerType.Stagger, weapons: [DestinyItemSubType.ScoutRifle] },
  { name: "Overloaded Auto/SMG", hash: 433122837, breakerType: DestinyBreakerType.Disruption, weapons: [DestinyItemSubType.AutoRifle, DestinyItemSubType.SubmachineGun] },
 // Tier 5
  { name: "Medival Champion", hash: 3257939736, breakerType: DestinyBreakerType.Stagger, weapons: [DestinyItemSubType.Glaive] },
];

export const analyzeChampionBreakers = (
  artifactPerks: AppArtifactType[],
  weaponTypes: DestinyItemSubType[],
  subclassDamageType: DamageType
) => {
  const breakers: { hash: number, sourceName: string }[] = [];

  // Start with the artifact perks
  artifactPerks.forEach(perk => {
    const breaker = breakerPerks.find(b => b.hash.toString() === perk.item.itemHash.toString());
    // if (breaker) console.log("B", breaker.name, breaker, intersection(breaker.weapons, weaponTypes).length > 0)
    if (breaker && intersection(breaker.weapons, weaponTypes).length > 0) {
      breakers.push({
        hash: breakerTypeToHash(breaker.breakerType),
        sourceName: breaker.name
      });
    }
  });

  // Now handle other rules
  // TODO: This needs to be a lot smarter, for now just give them credit for using the right subclass
  /*breakerDamageRules.forEach(rule => {
    console.log("R", rule, rule.damageType, subclassDamageType)
    if (rule.damageType === subclassDamageType) {
      breakers.push({
        hash: breakerTypeToHash(rule.breakerType),
        sourceName: rule.name
      });
    }
  });*/

  return breakers;
}