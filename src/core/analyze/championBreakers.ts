import { AppArtifactType, AppWeaponType } from "core/itemTypes";
import { diffHashes } from "utils/common";
import { breakerTraits, breakerTypeToHash } from "./helpers";
import { breakerPerks } from "./perks";

export enum BreakerSourceType {
  WeaponIntrinsic = 1,
  ArtifactPerk,
  Trait,
}

export type BreakerSource = {
  hash: number,
  sourceType: BreakerSourceType,
  sourceHash: number,
}

/**
 * Analyze data related to breaking champion mods and return what breakers exist.
 * 
 * A note on how breakers work:
 * Breakers cannot double dip, they are processed in the below order. First match wins.
 * intrinsic -> artifact -> traits
 */
export const analyzeChampionBreakers = (
  artifactPerks: AppArtifactType[],
  weapons: AppWeaponType[],
  traitHashes: number[],
) => {
  const breakers: BreakerSource[] = [];
  let unusedWeapons: AppWeaponType[] = [];

  // Handle weapons that have intrinsic breakers
  weapons.forEach(w => {
    if (w.definition.breakerTypeHash === undefined) {
      return unusedWeapons.push(w);
    }
    breakers.push({
      hash: w.definition.breakerTypeHash as number,
      sourceType: BreakerSourceType.WeaponIntrinsic,
      sourceHash: w.definition.hash,
    });
  });

  // Handle breakers from artifact perks
  artifactPerks.forEach(p => {
    const breaker = breakerPerks.find(b => diffHashes(b.hash, p.item.itemHash));
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
      sourceHash: breaker.hash,
      sourceType: BreakerSourceType.ArtifactPerk,
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
          sourceHash: trait.hash,
          sourceType: BreakerSourceType.Trait,
        });
      }
    });

  return breakers;
}
