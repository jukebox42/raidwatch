import { DamageType, DestinyBreakerTypeDefinition, DestinyItemSubType } from "bungie-api-ts/destiny2";

import { AppArmorType, AppBreakerType, AppSubclassType, AppWeaponType } from "core/itemTypes";
import { AppSocketType } from "core/sockets";

import { analyzeAmmoFinderSockets } from "./ammoFinderSockets";
import { analyzeChampionSockets, analyzeChampionSocketTypes, } from "./championSockets";
import { filterRaidSockets } from "./raidSockets";
import { analyzeChampionWeapons } from "./championWeapons";
import { analyzeAmmoScoutSockets } from "./ammoScoutSockets";
import { analyzeWeaponDamageTypeSockets } from "./weaponDamageTypeSockets";

export type ImportantSockets = {
  ammoFinderSockets: AppSocketType[],
  ammoScoutSockets: AppSocketType[],
  weaponDamageTypeSockets: AppSocketType[],
  championSockets: AppSocketType[],
  raidSockets: AppSocketType[],
};
export type AnalyzeData = {
  subclassDamageType: DamageType,
  weaponTypes: DestinyItemSubType[],
  weaponDamageTypes: DamageType[],
  canCauseExplosive: boolean,
  championBreakers: AppBreakerType[],
};

type AnalyzeType = (
  armors: AppArmorType[],
  weapons: AppWeaponType[],
  subclass: AppSubclassType,
  breakerDefinitions: { [key: number]: DestinyBreakerTypeDefinition },
) => { importantSockets: ImportantSockets, analyzeData: AnalyzeData };

/**
 * Analyze is gross and manual, it could probably be a lot better if we used data from perks but I have a feeling it'd
 * just be gross and convoluted so I'm sticking with this for now.
 */
export const analyze: AnalyzeType = (armors, weapons, subclass, breakerDefinitions) => {
  const allArmorSockets = armors.flatMap(a => a.armorSockets.mods);

  const analyzeData: AnalyzeData = {
    subclassDamageType: subclass.definition.talentGrid?.hudDamageType as DamageType,
    weaponTypes: weapons.map(w => w.definition.itemSubType),
    weaponDamageTypes: weapons.map(w => w.definition.damageTypes).flat(),
    canCauseExplosive: true, // TODO: Support this
    championBreakers: [],
  };

  // Weapon
  const ammoFinderSockets = analyzeAmmoFinderSockets(allArmorSockets);
  const ammoScoutSockets = analyzeAmmoScoutSockets(allArmorSockets);
  const weaponDamageTypeSockets = analyzeWeaponDamageTypeSockets(allArmorSockets, analyzeData.weaponDamageTypes);

  // Champion
  const championWeaponBreakers = analyzeChampionWeapons(weapons);
  // If any weapons have breakers on them already then filter them out. They cannot double dip.
  const nonBreakerWeaponTypes = weapons.filter(w => !!!w.definition.breakerTypeHash).map(w => w.definition.itemSubType);
  const championSockets = analyzeChampionSockets(allArmorSockets, nonBreakerWeaponTypes, analyzeData.subclassDamageType);
  
  const activeBreakers = [
    ...analyzeChampionSocketTypes(championSockets),
    ...championWeaponBreakers,
  ];
  const breakerHashes = Object.keys(breakerDefinitions).map(hash => {
    const sourceNames: string[] = [];
    activeBreakers.forEach(b => {
      if (b.hash.toString() === hash) {
        sourceNames.push(b.sourceName);
      }
    });
    return { hash, definition: breakerDefinitions[hash], sourceNames };
  });
  analyzeData.championBreakers = breakerHashes.filter(b => b.sourceNames.length > 0);

  // Misc
  const raidSockets = filterRaidSockets(allArmorSockets);

  return {
    importantSockets: {
      championSockets,
      raidSockets,
      ammoFinderSockets,
      ammoScoutSockets,
      weaponDamageTypeSockets,
    },
    analyzeData,
  }
}
