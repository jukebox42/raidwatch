import { DamageType, DestinyBreakerTypeDefinition, DestinyItemSubType } from "bungie-api-ts/destiny2";

import { AppArmorType, AppArtifactType, AppBreakerType, AppSubclassType, AppWeaponType } from "core/itemTypes";
import { AppSocketType } from "core/sockets";

import { analyzeAmmoFinderSockets } from "./ammoFinderSockets";
import { filterRaidSockets } from "./raidSockets";
import { analyzeAmmoScoutSockets } from "./ammoScoutSockets";
import { analyzeWeaponDamageTypeSockets } from "./weaponDamageTypeSockets";
import { analyzeChampionBreakers } from "./championBreakers";
import { diffHashes } from "utils/common";

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
    championBreakers: [],
  };

  // Traits (we need them for breakers)
  // https://data.destinysets.com/i/InventoryItem:3730619869/Trait:308023312 (if we wanna show em)
  const traitHashes: number[] = [
    ...armors.map(a => a.definition.traitHashes).flat(),
    ...weapons.map(w => w.definition.traitHashes).flat(),
    ...subclass.definition.traitHashes,
    ...subclass.subclassSockets.fragments.map(f => f.definition.traitHashes).flat(),
    ...subclass.subclassSockets.aspects.map(f => f.definition.traitHashes).flat(),
    ...( subclass.subclassSockets.ability.definition.traitHashes ? subclass.subclassSockets.ability.definition.traitHashes : []),
    ...( subclass.subclassSockets.melee.definition.traitHashes ? subclass.subclassSockets.melee.definition.traitHashes : []),
    ...( subclass.subclassSockets.grenade.definition.traitHashes ? subclass.subclassSockets.grenade.definition.traitHashes : []),
    ...( subclass.subclassSockets.super.definition.traitHashes ? subclass.subclassSockets.super.definition.traitHashes : []),
  ].filter((i, p, s) => s.indexOf(i) === p);

  // Weapon
  const ammoFinderSockets = analyzeAmmoFinderSockets(allArmorSockets);
  const ammoScoutSockets = analyzeAmmoScoutSockets(allArmorSockets);
  const weaponDamageTypeSockets = analyzeWeaponDamageTypeSockets(
    allArmorSockets, analyzeData.weaponDamageTypes, analyzeData.subclassDamageType);

  // Champion
  const activeBreakers = analyzeChampionBreakers(artifactPerks, weapons, traitHashes);
  const breakerHashes = Object.keys(breakerDefinitions).map(hash => {
    const sourceNames: string[] = [];
    activeBreakers.forEach(b => {
      if (diffHashes(b.hash, hash)) {
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
