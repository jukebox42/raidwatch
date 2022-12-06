import { AppWeaponType } from "core/itemTypes";

/**
 * Returns a map of breaker hashes and weapon names.
 * 
 * If a weapon supports a breaker type it'll have the breakerTypeHash property on it's definition.
 */
export const analyzeChampionWeapons = (weapons: AppWeaponType[]) => {
  return weapons
    .filter(w => w.definition.breakerTypeHash !== undefined)
    .map(w => ({
      hash: w.definition.breakerTypeHash as number,
      sourceName: w.definition.displayProperties.name,
    }));
}
