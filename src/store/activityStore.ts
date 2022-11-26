import { StateCreator } from "zustand";
import { PlayerStore } from "./playerStore";
import db from "./db";

export type ActivityStore = {
  setActivePlayer: (membershipId: string) => void,
}

export const createActivityStore: StateCreator<PlayerStore & ActivityStore, any, [], ActivityStore> = (set, get) => ({
  setActivePlayer: async (membershipId: string) => {
    console.log("playerStore:setActivePlayer", membershipId);
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
});