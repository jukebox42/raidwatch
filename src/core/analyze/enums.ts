export enum SocketPurpose {
  ammoFinderSockets = 1,
  ammoScoutSockets,
  ammoScavengerSockets,
  artifactSockets,
  championSockets,
  chargedWithLightChargerSockets,
  chargedWithLightSpenderSockets,
  raidSockets,
  wellGeneratorSockets,
  wellSpenderSockets,
}

export enum SocketUnusableReason {
  missingWeapon = 1,
  missingEnergyType,
  missingDamageType,
  wrongSubclass,
  missingLightCharger,
  missingWellGenerator,
  missingWellEnergyType,
  missingChampionBreaker,
  unknown,
  unsupported,
}
