import { DamageType, DestinyBreakerTypeDefinition, DestinyEnergyType, DestinyItemSubType } from "bungie-api-ts/destiny2";

import { AppArmorType, AppBreakerType, AppSubclassType, AppWeaponType } from "core/itemTypes";
import { AppSocketType } from "core/sockets";

import { damageTypeToEnergyType } from "./helpers";

import { analyzeAmmoFinderSockets } from "./ammoFinderSockets";
import { analyzeAmmoScavengerSockets } from "./ammoScavengerSockets";
import { filterArtifactSockets } from "./artifactSockets";
import { analyzeChampionSockets, analyzeChampionSocketTypes, } from "./championSockets";
import { analyzeChargedWithLightChargerSockets, analyzeChargedWithLightSpenderSockets } from "./chargedWithLightSockets";
import { filterRaidSockets } from "./raidSockets";
import { analyzeWellGeneratorSockets, analyzeWellSpenderSockets } from "./wellSockets";
import { analyzeChampionWeapons } from "./championWeapons";

export type ImportantSockets = {
  ammoFinderSockets: AppSocketType[],
  ammoScavengerSockets: AppSocketType[],
  artifactSockets: AppSocketType[],
  championSockets: AppSocketType[],
  chargedWithLightChargerSockets: AppSocketType[],
  chargedWithLightSpenderSockets: AppSocketType[],
  raidSockets: AppSocketType[],
  wellGeneratorSockets: AppSocketType[],
  wellSpenderSockets: AppSocketType[],
};
export type AnalyzeData = {
  subclassEnergyType: DestinyEnergyType,
  weaponTypes: DestinyItemSubType[],
  weaponDamageTypes: DamageType[],
  wellTypesGenerated: DestinyEnergyType[],
  canCharge: boolean,
  canChargeFriends: boolean,
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
    subclassEnergyType: damageTypeToEnergyType(subclass.definition.talentGrid?.hudDamageType as DamageType),
    weaponTypes: weapons.map(w => w.definition.itemSubType),
    weaponDamageTypes: weapons.map(w => w.definition.damageTypes).flat(),
    wellTypesGenerated: [],
    canCharge: false,
    canChargeFriends: false,
    canCauseExplosive: true, // TODO: Support this
    championBreakers: [],
  };

  // Weapon
  const ammoFinderSockets = analyzeAmmoFinderSockets(allArmorSockets, analyzeData.weaponTypes);
  const ammoScavengerSockets = analyzeAmmoScavengerSockets(allArmorSockets, analyzeData.weaponTypes);

  // Champion
  const championSockets = analyzeChampionSockets(allArmorSockets, analyzeData.weaponTypes, analyzeData.subclassEnergyType);
  const championBreakerHashes = analyzeChampionWeapons(weapons);
  const activeBreakers = [
    ...analyzeChampionSocketTypes(championSockets),
    ...championBreakerHashes,
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
  const artifactSockets = filterArtifactSockets(allArmorSockets);
  const raidSockets = filterRaidSockets(allArmorSockets);

  // Charged with light
  const { chargedWithLightChargerSockets, canCharge, canChargeFriends } = analyzeChargedWithLightChargerSockets(
    allArmorSockets,
    analyzeData.weaponTypes);
  analyzeData.canCharge = canCharge;
  analyzeData.canChargeFriends = canChargeFriends;

  const chargedWithLightSpenderSockets = analyzeChargedWithLightSpenderSockets(
    allArmorSockets,
    analyzeData.weaponTypes,
    analyzeData.weaponDamageTypes,
    analyzeData.subclassEnergyType,
    analyzeData.canCharge);

  // Well
  const { wellGeneratorSockets, generatedWellEnergies } = analyzeWellGeneratorSockets(
    allArmorSockets,
    analyzeData.weaponDamageTypes,
    analyzeData.subclassEnergyType);
  analyzeData.wellTypesGenerated = generatedWellEnergies;
  const wellSpenderSockets = analyzeWellSpenderSockets(
    allArmorSockets,
    analyzeData.subclassEnergyType,
    generatedWellEnergies);

  return {
    importantSockets: {
      championSockets,
      chargedWithLightChargerSockets,
      chargedWithLightSpenderSockets,
      wellGeneratorSockets,
      wellSpenderSockets,
      raidSockets,
      ammoFinderSockets,
      ammoScavengerSockets,
      artifactSockets,
    },
    analyzeData,
  }
}
