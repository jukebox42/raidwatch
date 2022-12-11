import create from "zustand";
import { devtools } from 'zustand/middleware'

import { ManifestStore, createManifestStore } from "store/manifestStore";
import { createPlayerStore, PlayerStore } from "store/playerStore";
import { ActivityStore, createActivityStore } from "store/activityStore";
import { createToastStore, ToastStore } from "store/toastStore";

type Store = ManifestStore & PlayerStore & ActivityStore & ToastStore;

export const useStore = create<Store>()(devtools((...a) => ({
  ...createToastStore(...a),
  ...createManifestStore(...a),
  ...createPlayerStore(...a),
  ...createActivityStore(...a),
})));
