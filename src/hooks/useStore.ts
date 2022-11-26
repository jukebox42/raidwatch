import create from "zustand";
import { devtools } from 'zustand/middleware'

import { ManifestStore, createManifestStore } from "store/manifestStore";
import { createPlayerStore, PlayerStore } from "store/playerStore";
import { ActivityStore, createActivityStore } from "store/activityStore";

export const useStore = create<ManifestStore & PlayerStore & ActivityStore>()(devtools((...a) => ({
  ...createManifestStore(...a),
  ...createPlayerStore(...a),
  ...createActivityStore(...a),
})));
