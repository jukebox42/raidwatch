import { AllDestinyManifestComponents, getPublicMilestones } from "bungie-api-ts/destiny2";

import { StateCreator } from "zustand";
import { PlayerStore } from "./playerStore";
import db from "./db";

import { $http } from "bungie/api";
import { ManifestStore } from "./manifestStore";
import { AppActivity, getActivitiesData } from "core";
import { ErrorStore } from "./errorStore";


export type ActivityStore = {
  activePlayer: string,
  activities: AppActivity[],
  setActivePlayer: (membershipId: string) => void,
  loadActivities: () => void,
}

type Store = PlayerStore & ManifestStore & ActivityStore & ErrorStore;

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
    if (get().checkApiError(response)) {
      return;
    }
    const activities = getActivitiesData(Object.values(response.Response), get().manifest as AllDestinyManifestComponents);
    console.log("activityStore:loadActivities", activities);
    set({ activities });
  },
});