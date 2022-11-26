export enum SocketPurpose {
  ammoFinderSockets = 1,
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
  wrongSubclass,
  missingLightCharger,
  missingWellGenerator,
  missingWellEnergyType,
  unknown,
  unsupported,
}
