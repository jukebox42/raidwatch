import { AllDestinyManifestComponents, DestinyActivityDefinition, DestinyActivityModifierDefinition, DestinyPublicMilestone, DestinyPublicMilestoneChallengeActivity, getPublicMilestones } from "bungie-api-ts/destiny2";

import { StateCreator } from "zustand";
import { PlayerStore } from "./playerStore";
import db from "./db";

import { $http } from "bungie/api";
import { ManifestStore } from "./manifestStore";

export type AppActivity = {
  activity: DestinyPublicMilestoneChallengeActivity,
  definition: DestinyActivityDefinition,
  modifiers: DestinyActivityModifierDefinition[],
}

export type ActivityStore = {
  activePlayer: string,
  activities: AppActivity[],
  setActivePlayer: (membershipId: string) => void,
  loadActivities: () => void,
}

const getActivitiesData = (activities: DestinyPublicMilestone[], manifest: AllDestinyManifestComponents) => {
  const activitiesList = activities
    .filter(a => !!a.activities)
    .flatMap(a => a.activities)
    .filter(a => !!a.modifierHashes)
    .map(activity => ({
      activity,
      definition: manifest.DestinyActivityDefinition[activity.activityHash],
      modifiers: activity.modifierHashes.map(m => manifest.DestinyActivityModifierDefinition[m]),
    }));

  return [
    ...activitiesList.filter(
      (a, i) => activitiesList.findIndex(b => b.activity.activityHash.toString() === a.activity.activityHash.toString()) === i)
  ];
}

export const createActivityStore: StateCreator<PlayerStore & ActivityStore & ManifestStore, any, [], ActivityStore> = (set, get) => ({
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
    console.log("activityStore:loadActivities");
    const result = await getPublicMilestones($http);
    const activities = getActivitiesData(Object.values(result.Response), get().manifest as AllDestinyManifestComponents);
    set({ activities });
  },
});