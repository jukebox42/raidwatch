import { AllDestinyManifestComponents, getPublicMilestones } from "bungie-api-ts/destiny2";

import { StateCreator } from "zustand";
import { PlayerStore } from "./playerStore";
import db from "./db";

import { $http } from "bungie/api";
import { ManifestStore } from "./manifestStore";
import { AppActivity, getActivitiesData } from "core";
import { ToastStore } from "./toastStore";


export type ActivityStore = {
  activePlayer: string,
  activities: AppActivity[],
  setActivePlayer: (membershipId: string) => void,
  loadActivities: () => void,
}

type Store = PlayerStore & ManifestStore & ActivityStore & ToastStore;

export const createActivityStore: StateCreator<Store, any, [], ActivityStore> = (set, get) => ({
  activePlayer: "",
  activities: [],

  setActivePlayer: async (membershipId: string) => {
    console.log("activityStore:setActivePlayer", membershipId);
    if (membershipId === "") {
      db.setConfig({ activePlayer: "" });
      set({ activePlayer: "" });
    }
    const player = get().players.find(p => p.membershipId === membershipId);
    db.setConfig({ activePlayer: !player ? "" : membershipId });
    set({ activePlayer: !player ? "" : membershipId });
    if (membershipId) {
      get().erasePlayerProfiles();
    }
  },
  loadActivities: async () => {
    const response = await getPublicMilestones($http);
    if (get().checkError(response)) {
      return;
    }
    const activities = getActivitiesData(Object.values(response.Response), get().manifest as AllDestinyManifestComponents);
    console.log("activityStore:loadActivities", activities);
    set({ activities });
  },
});