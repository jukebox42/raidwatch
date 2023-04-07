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
  isCollapsed: boolean,
  selectedActivity: string,
  setActivePlayer: (membershipId: string) => void,
  setSelectedActivity: (activityId: string) => void,
  toggleIsCollapsed: () => void,
  loadActivities: () => void,
}

type Store = PlayerStore & ManifestStore & ActivityStore & ErrorStore;

export const createActivityStore: StateCreator<Store, any, [], ActivityStore> = (set, get) => ({
  activePlayer: "",
  selectedActivity: "",
  activities: [],
  isCollapsed: false,

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
  setSelectedActivity: (activityId: string) => {
    console.log("activityStore:setSelectedActivity", activityId);
    db.setConfig({ selectedActivity: activityId });
    set({ selectedActivity: activityId });
  },
  loadActivities: async () => {
    const config = await db.getConfig();

    const response = await getPublicMilestones($http);
    if (get().checkApiError(response)) {
      return;
    }
    const activities = getActivitiesData(Object.values(response.Response), get().manifest as AllDestinyManifestComponents);
    console.log("activityStore:loadActivities", activities, config.selectedActivity);
    set({
      activities,
      isCollapsed: !!config.isActivityCollapsed, // TODO: bad place to do this but eh...
      selectedActivity: config.selectedActivity ? config.selectedActivity : ""
    });
  },
  toggleIsCollapsed: () => {
    const isCollapsed = get().isCollapsed;
    console.log("activityStore:toggleIsCollapsed", !isCollapsed);
    db.setConfig({ isActivityCollapsed: !isCollapsed });
    set({ isCollapsed: !isCollapsed });
  }
});