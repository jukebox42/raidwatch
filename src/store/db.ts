import Dexie, { Table } from "dexie";
import { AllDestinyManifestComponents } from "bungie-api-ts/destiny2";

import { UserSearchResponseDetail } from "bungie-api-ts/user";
import { AppSettings } from "types/settings";
import { PlayerData } from "types/player";
import { AppConfig } from "types/config";

const INDEX = 0;

export const defaultSettings = {
  hideSynergy: false,
  hideSynergyActivity: false,
  hideAnalyzeMods: false,
  hideAmmoFinderMods: false,
  hideAmmoScavengerMods: false,
  hideChampionMods: false,
  hideChargedWithLightMods: false,
  hideWellMods: false,
  hideWarmindMods: false,
  hideRaidMods: false,
};

class Db extends Dexie {
  AppSettings!: Table<AppSettings>;
  AppSearches!: Table<UserSearchResponseDetail>;
  AppPlayers!: Table<PlayerData>;
  AppConfig!: Table<AppConfig>;

  ManifestVersion!: Table<string>;
  BungieManifest!: Table<AllDestinyManifestComponents>;

  constructor() {
    super("raidwatch2");
  }

  init() {
    // Do nothing if we're already open
    if (this.isOpen()) {
      return Promise.resolve();
    }

    this.version(1).stores({
      AppSettings: "",
      AppSearches: "",
      AppPlayers: "",
      AppConfig: "",

      ManifestVersion: "",
      BungieManifest: "",
    });

    return this.open();
  }

  async getManifestVersion() {
    return await this.ManifestVersion.get(INDEX) ?? "";
  }

  async setManifestVersion(version: string) {
    return await this.ManifestVersion.put(version, INDEX);
  }

  async getManifest() {
    return await this.BungieManifest.get(INDEX);
  }

  async setManifest(data: AllDestinyManifestComponents) {
    return await this.BungieManifest.put(data, INDEX);
  }

  async getSettings() {
    return await this.AppSettings.get(INDEX) ?? { ...defaultSettings };
  }

  async setSettings(data: AppSettings) {
    return await this.AppSettings.put(data, INDEX);
  }

  async getConfig() {
    const defaultConfig = { activePlayer: "" };
    return await this.AppConfig.get(INDEX) ?? { ...defaultConfig };
  }

  async setConfig(data: AppConfig) {
    return await this.AppConfig.put(data, INDEX);
  }

  /**
   * Delete the database, this is used as a purge action
   */
  async clearAllCache() {
    await this.delete();
  }
}

const db = new Db();
export default db;
