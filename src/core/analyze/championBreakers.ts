import { AppArtifactType, AppWeaponType } from "core/itemTypes";
import { diffHashes } from "utils/common";
import { breakerTraits, breakerTypeToHash } from "./helpers";
import { breakerPerks } from "./mods";


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