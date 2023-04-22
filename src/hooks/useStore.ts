import { create } from "zustand";
import { devtools } from 'zustand/middleware'

import { ManifestStore, createManifestStore } from "store/manifestStore";
import { createPlayerStore, PlayerStore } from "store/playerStore";
import { ActivityStore, createActivityStore } from "store/activityStore";
import { createErrorStore, ErrorStore } from "store/errorStore";
import { createSettingsStore, SettingsStore } from "store/settingsStore";

type Store = ManifestStore & PlayerStore & ActivityStore & ErrorStore & SettingsStore;

export const useStore = create<Store>()(devtools((...a) => ({
  ...createErrorStore(...a),
  ...createManifestStore(...a),
  ...createPlayerStore(...a),
  ...createActivityStore(...a),
  ...createSettingsStore(...a),
})));
