import intersection from "lodash/intersection";
import { DamageType, DestinyBreakerType, DestinyItemSubType } from "bungie-api-ts/destiny2"

import { AppArtifactType, AppWeaponType } from "core/itemTypes";
import { breakerTypeToHash } from "./helpers"

type BreakerPerkTypes = {
  name: string,
  hash: number,
  breakerType: DestinyBreakerType,
  weapons: DestinyItemSubType[]
}

export const breakerTraits = [
  { name: "Radiant", hash: 1973222647, breakerType: DestinyBreakerType.ShieldPiercing },
  { name: "Ignition", hash: 2127908492, breakerType: DestinyBreakerType.Stagger },
  { name: "Blind", hash: 1679107659, breakerType: DestinyBreakerType.Stagger },
  { name: "Jolted", hash: 2228690371, breakerType: DestinyBreakerType.Disruption },
  { name: "Volatile rounds", hash: 2650036230, breakerType: DestinyBreakerType.ShieldPiercing, weaponDamageType: DamageType.Void },
  { name: "Suppression", hash: 3172172883, breakerType: DestinyBreakerType.Disruption },
  { name: "Slow", hash: 4135386068, breakerType: DestinyBreakerType.Disruption },
  { name: "Shatter", hash: 4272830254, breakerType: DestinyBreakerType.Stagger },
  { name: "Suspend", hash: 3271908156, breakerType: DestinyBreakerType.Stagger },
  { name: "Unraveling rounds", hash: 622080519, breakerType: DestinyBreakerType.ShieldPiercing, weaponDamageType: DamageType.Strand },
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
  weapons: AppWeaponType[],
  traitHashes: number[],
) => {
  /********************
   * A note on how breakers work:
   * Breakers cannot double dip, they are processed in the below order.
   * First match wins. so we trim out weapons as they are used.
   * intrinsic -> artifact -> traits
   ********************/
  const breakers: { hash: number, sourceName: string }[] = [];
  let unusedWeapons: AppWeaponType[] = [];

  // Handle weapons that have intrinsic breakers
  weapons.forEach(w => {
    if (w.definition.breakerTypeHash === undefined) {
      return unusedWeapons.push(w);
    }
    breakers.push({
      hash: w.definition.breakerTypeHash as number,
      sourceName: w.definition.displayProperties.name,
    });
  });

  // Handle breakers from artifact perks
  artifactPerks.forEach(p => {
    const breaker = breakerPerks.find(b => b.hash.toString() === p.item.itemHash.toString());
    if (!breaker) {
      return;
    }

    const matches = unusedWeapons
      .map((w, i) => ({index: i, weapon: w}))
      .filter(w => breaker.weapons.includes(w.weapon.definition.itemSubType));
    if (!matches.length) {
      return;
    }
    breakers.push({
      hash: breakerTypeToHash(breaker.breakerType),
      sourceName: breaker.name
    });
    matches.forEach(m => unusedWeapons.splice(m.index, 1));
  });

  // Handle traits
  const weaponDamageTypes = unusedWeapons.flatMap(w => w.definition.damageTypes);
  breakerTraits
    .forEach(trait => {
      if (
        traitHashes.includes(trait.hash) && 
        (!trait.weaponDamageType || weaponDamageTypes.includes(trait.weaponDamageType))
      ) {
        breakers.push({
          hash: breakerTypeToHash(trait.breakerType),
          sourceName: trait.name
        });
      }
    });

  return breakers;
}