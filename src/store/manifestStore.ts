import { StateCreator } from "zustand";
import { AllDestinyManifestComponents, getAllDestinyManifestComponents, getDestinyManifest } from "bungie-api-ts/destiny2";

import { $http, $httpUnsigned } from "bungie/api";
import db from "./db";
import { LANGUAGE } from "utils/constants";
import { ToastStore } from "./toastStore";

export type ManifestStore = {
  isInitialized: boolean,
  manifest: AllDestinyManifestComponents | undefined,
  manifestVersion: string,
  loadingMessage: string,

  loadManifest: () => Promise<void>,
}

export const createManifestStore: StateCreator<ManifestStore & ToastStore, any, [], ManifestStore> = (set, get) => ({
  isInitialized: false,
  manifest: undefined,
  manifestVersion: "",
  loadingMessage: "",

  loadManifest: async () => {
    console.log("manifestStore:loadManifest");
    set({ loadingMessage: "Checking manifest..." });
    await db.init();
    // Get the manifest data (where the components are)
    const manifestResponse = await getDestinyManifest($http);
    if (get().checkError(manifestResponse)) {
      return;
    }

    const manifest = manifestResponse.Response;
    
    // Do some version checking and return the db data if version hasnt change
    const manifestVersion = manifest.version;
    const currentVersion = await db.getManifestVersion();
    if (manifestVersion === currentVersion) {
      return set({ manifest: await db.getManifest(), manifestVersion, isInitialized: true });
    }

    set({ loadingMessage: "Downloading manifest..." });
  
    // Fetch the new data since the version did change
    getAllDestinyManifestComponents($httpUnsigned, {
      destinyManifest: manifest,
      language: LANGUAGE,
    }).then((components) => {
      db.setManifest(components);
      // always set version last, if above erros it'll ensure we force a new fetch.
      db.setManifestVersion(manifestVersion);
      set({ manifest: components, manifestVersion, isInitialized: true });
    }).catch(reason => {
      get().showToast(reason.toString(), "ManifestComponentsFailed", true);
    });
  }
});
