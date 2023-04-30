import { DamageType, DestinyBreakerTypeDefinition, DestinyEquippingBlockDefinition, DestinyItemSubType } from "bungie-api-ts/destiny2";
import toInteger from "lodash/toInteger";

import { AppArmorType, AppArtifactType, AppBreakerType, AppSubclassType, AppWeaponType } from "core/itemTypes";
import { BreakerSource, analyzeChampionBreakers } from "./championBreakers";
import { diffHashes } from "utils/common";
import { ImportantSockets, processMods } from "./processMods";

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
    subclassDamageType: subclass.damageType,
    weaponTypes: weapons.map(w => w.definition.itemSubType),
    weaponDamageTypes: weapons.map(w => w.definition.damageTypes).flat(),
    championBreakers: [],
  };

  // Important Sockets
  const weaponAmmoTypes = weapons.map(w => (w.definition.equippingBlock as DestinyEquippingBlockDefinition).ammoType);
  const importantSockets = processMods(
    allArmorSockets,
    analyzeData.weaponDamageTypes,
    weaponAmmoTypes,
    analyzeData.subclassDamageType
  );

  // Traits (we need them for breakers)
  const subSockets = subclass.subclassSockets;
  const subSocketHashes = [];
  if (subSockets) {
    subSocketHashes.push(
    ...(subSockets.fragments.length > 0 ? subSockets.fragments.map(f => f.definition.traitHashes).flat() : []),
    ...(subSockets.aspects.length > 0 ? subSockets.aspects.map(f => f.definition.traitHashes).flat() : []),
    ...(subSockets.ability.definition.traitHashes ? subSockets.ability.definition.traitHashes : []),
    ...(subSockets.melee.definition.traitHashes ? subSockets.melee.definition.traitHashes : []),
    ...(subSockets.grenade.definition.traitHashes ? subSockets.grenade.definition.traitHashes : []),
    ...(subSockets.super.definition.traitHashes ? subSockets.super.definition.traitHashes : []),
    )
  }
  const traitHashes: number[] = [
    ...armors.map(a => a.definition.traitHashes).flat(),
    ...weapons.map(w => w.definition.traitHashes).flat(),
    ...subclass.definition.traitHashes,
    ...subSocketHashes,
  ].filter((i, p, s) => s.indexOf(i) === p);

  // Champion
  const activeBreakers = analyzeChampionBreakers(artifactPerks, weapons, traitHashes);
  const breakerHashes = Object.keys(breakerDefinitions).map(hash => {
    const sources: BreakerSource[] = []
    activeBreakers.forEach(b => {
      if (diffHashes(b.hash, hash)) {
        sources.push(b);
      }
    });
    return { hash, definition: breakerDefinitions[toInteger(hash)], sources };
  });
  analyzeData.championBreakers = breakerHashes.filter(b => b.sources.length > 0);

  return {
    importantSockets,
    analyzeData,
  }
}
