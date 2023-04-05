export enum SocketPurpose {
  ammoFinderSockets = 1,
  ammoScoutSockets,
  ammoScavengerSockets,
  artifactSockets,
  championSockets,
  raidSockets,
  wellGeneratorSockets,
  wellSpenderSockets,
}

export enum SocketUnusableReason {
  missingWeapon = 1,
  missingEnergyType,
  missingDamageType,
  wrongSubclass,
  missingWellGenerator,
  missingWellEnergyType,
  missingChampionBreaker,
  unknown,
  unsupported,
}
