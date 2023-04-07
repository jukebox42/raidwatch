import { DamageType, DestinyBreakerTypeDefinition, DestinyItemSubType } from "bungie-api-ts/destiny2";

import { AppArmorType, AppArtifactType, AppBreakerType, AppSubclassType, AppWeaponType } from "core/itemTypes";
import { AppSocketType } from "core/sockets";

import { analyzeAmmoFinderSockets } from "./ammoFinderSockets";
import { analyzeChampionSockets, analyzeChampionSocketTypes, } from "./championSockets";
import { filterRaidSockets } from "./raidSockets";
import { analyzeChampionWeapons } from "./championWeapons";
import { analyzeAmmoScoutSockets } from "./ammoScoutSockets";
import { analyzeWeaponDamageTypeSockets } from "./weaponDamageTypeSockets";
import { analyzeChampionBreakers } from "./championBreakers";

export type ImportantSockets = {
  ammoFinderSockets: AppSocketType[],
  ammoScoutSockets: AppSocketType[],
  weaponDamageTypeSockets: AppSocketType[],
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
  artifactPerks: AppArtifactType[],
  breakerDefinitions: { [key: number]: DestinyBreakerTypeDefinition },
) => { importantSockets: ImportantSockets, analyzeData: AnalyzeData };

/**
 * Analyze is gross and manual, it could probably be a lot better if we used data from perks but I have a feeling it'd
 * just be gross and convoluted so I'm sticking with this for now.
 */
export const analyze: AnalyzeType = (armors, weapons, subclass, artifactPerks, breakerDefinitions) => {
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
  // TODO: Replace all this breaker stuff with the new breaker stuff. remember subclass breakers ok?
  const championWeaponBreakers = analyzeChampionWeapons(weapons);
  // If any weapons have breakers on them already then filter them out. They cannot double dip.
  const nonBreakerWeaponTypes = weapons.filter(w => !!!w.definition.breakerTypeHash).map(w => w.definition.itemSubType);
  const championBreakers = analyzeChampionBreakers(artifactPerks, nonBreakerWeaponTypes, analyzeData.subclassDamageType);
  
  const activeBreakers = [
    ...championBreakers,
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
      raidSockets,
      ammoFinderSockets,
      ammoScoutSockets,
      weaponDamageTypeSockets,
    },
    analyzeData,
  }
}
