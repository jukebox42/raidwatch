import { StateCreator } from "zustand";
import { AllDestinyManifestComponents, BungieMembershipType, getProfile } from "bungie-api-ts/destiny2";

import { PlayerData, PLAYER_COMPONENTS, PLAYER_LIVE_COMPONENTS } from "types/player";
import { AppCharacterType, getData } from "core";
import { $http } from "bungie/api";
import { lastOnlineCharacterId } from "components/Player/Character/utils/common";
import db from "./db";
import { ManifestStore } from "./manifestStore";
import { getMembershipDataById } from "bungie-api-ts/user";
import { ActivityStore } from "./activityStore";

const loadPlayerProfile = async (membershipId: string, membershipType: BungieMembershipType, onlyLive=false) => {
  const profileResponse = await getProfile($http, {
    components: onlyLive ? PLAYER_LIVE_COMPONENTS : PLAYER_COMPONENTS,
    destinyMembershipId: membershipId,
    membershipType: membershipType,
  });
  return profileResponse.Response;
}

export type PlayerStore = {
  players: PlayerData[],

  loadPlayers: () => void,
  setPlayers: (players: PlayerData[]) => Promise<void>,
  addPlayer: (membershipId: string, membershipType: BungieMembershipType, selectedCharacterId?: string, isEnemy?: boolean) => void,
  removePlayer: (membershipId: string) => void,
  loadPlayerProfile: (membershipId: string) => Promise<void | {}>,
  erasePlayerProfiles: () => void,
  setPlayerCharacterId: (membershipId: string, selectedCharacterId: string) => void,
  setChatacterData: (characterData: AppCharacterType) => void,
}

export const createPlayerStore: StateCreator<PlayerStore & ManifestStore & ActivityStore, any, [], PlayerStore> = (set, get) => ({
  players: [],

  loadPlayers: async () => {
    console.log("playerStore:loadPlayers");
    const players = await db.AppPlayers.toArray();
    const config = await db.getConfig();
    console.log("PLAYERS", players);
    set({ players, activePlayer: config.activePlayer });

    // TODO: I know this violates the "no sideeffects" rule but I think it's cleaner and we NEED
    //       this to always happen.
    players.forEach(p => get().loadPlayerProfile(p.membershipId));
  },

  setPlayers: async (players: PlayerData[]) => {
    console.log("playerStore:setPlayers", players);
    const activePlayer = players.find(p => p.membershipId === get().activePlayer);
    await db.AppPlayers.clear();
    await db.AppPlayers.bulkAdd(players, players.map(p => p.membershipId));
    set({
      players: [ ...players ],
      activePlayer: activePlayer ? activePlayer.membershipId : "",
    });
    players.forEach(p => get().loadPlayerProfile(p.membershipId));
  },

  addPlayer: (
    membershipId: string, membershipType: BungieMembershipType, selectedCharacterId: string = "",
    isEnemy: boolean = false
  ) => {
    const player: PlayerData = {
      membershipId,
      membershipType,
      profile: undefined,
      selectedCharacterId,
      isEnemy,
    };
    console.log("playerStore:addPlayer", player);
    db.AppPlayers.put(player, membershipId);
    set({ players: [...get().players, player] });
    // TODO: More violating "no sideeffects" but again, I kinda think it belongs here
    get().loadPlayerProfile(player.membershipId);
  },

  removePlayer: (membershipId: string) => set(state => {
    console.log("playerStore:removePlayer", membershipId, state.players);
    if (!state.players.find(p => p.membershipId === membershipId)) {
      console.log("PLAYER NOT FOUND");
      return {};
    }

    db.AppPlayers.delete(membershipId);
    return {
      players: state.players.filter(p => p.membershipId !== membershipId),
      activePlayer: state.activePlayer === membershipId ? "" : state.activePlayer,
    };
  }),

  loadPlayerProfile: async (membershipId: string) => {
    console.log("playerStore:loadPlayerProfile", membershipId);
    const player = get().players.find(p => p.membershipId === membershipId);
    if (!player || player.membershipType === undefined) {
      return {};
    }

    const profile = await loadPlayerProfile(membershipId, player.membershipType);

    // if we dont have a selected character select one
    const selectedCharacterId = !player.selectedCharacterId && profile.characters.data ?
      lastOnlineCharacterId(profile.characters.data) : player.selectedCharacterId;

    // TODO: More violating "no sideeffects" but again, I kinda think it belongs here
    const characterData = getData(profile, selectedCharacterId, get().manifest as AllDestinyManifestComponents);

    return set(state => ({
      players: state.players.map(player => {
        if (player.membershipId === membershipId) {
          return {
            ...player,
            profile,
            characterData,
            selectedCharacterId,
          };
        }
        return { ...player };
      })
    }));
  },

  erasePlayerProfiles: () => {
    console.log("playerStore:erasePlayerProfiles");
    const players = get().players.map(p => ({ ...p, profile: undefined, characterData: undefined }));
    set({ players });
    // If there is no active player then just refresh the existing list.
    const activePlayerId = get().activePlayer;
    if (!activePlayerId) {
      // TODO: More violating "no sideeffects" but again, I kinda think it belongs here
      get().players.forEach(p => get().loadPlayerProfile(p.membershipId));
      return;
    }

    // If there is an active player do more
    const activePlayer = get().players.find(p => p.membershipId === activePlayerId) as PlayerData;
    loadPlayerProfile(activePlayerId, activePlayer.membershipType, true).then(activePlayerProfile => {
      // See if the active player is online, if not then just refresh the list
      if (!activePlayerProfile.profileTransitoryData.data || !activePlayerProfile.profileTransitoryData.data.partyMembers.length) {
        // TODO: Need to inform the user that the player is not online
  
        // TODO: More violating "no sideeffects" but again, I kinda think it belongs here
        get().players.forEach(p => get().loadPlayerProfile(p.membershipId));
        return;
      }

      // Player is logged in, so purge the list and load the new list of party members
      // TODO: This is a kind of a mess but it handles forcing the active player list to be the loaded list.
      console.log("playerStore:erasePlayerProfiles Result", activePlayerProfile.profileTransitoryData.data);
      const membershipIds = activePlayerProfile.profileTransitoryData.data.partyMembers.map(p => p.membershipId.toString());
      const players = get().players.map(p => ({ ...p, profile: undefined, characterData: undefined }));
      const newPlayers: PlayerData[] = [];
      const idQueue: string[] = [];
      // Keep the players that are already loaded and in the party. queue the ones not
      membershipIds.forEach(id => {
        const existingPlayer = players.find(p => p.membershipId === id);
        if (existingPlayer) {
          return newPlayers.push(existingPlayer);
        }
        return idQueue.push(id);
      });

      // cleanup the database for all players that arent in the party but were loaded
      const removeIds = players.map(p => p.membershipId).filter(id => !membershipIds.includes(id));
      console.log("playerStore:erasePlayerProfiles Queues", removeIds, idQueue, newPlayers);
      db.AppPlayers.bulkDelete(removeIds);
      
      set({ players: newPlayers });
      // load existing players profiles
      get().players.forEach(p => get().loadPlayerProfile(p.membershipId));
      // If we have more then load them
      if (idQueue.length > 0) {
        idQueue.forEach(id => {
          getMembershipDataById($http, { membershipId: id, membershipType: BungieMembershipType.None }).then(membershipData => {
            get().addPlayer(id, membershipData.Response.destinyMemberships[0].membershipType);
          });
        });
      }
    });
  },

  setPlayerCharacterId: (membershipId: string, selectedCharacterId: string) => set(state => {
    console.log("playerStore:setPlayerCharacterId", membershipId, selectedCharacterId);
    const foundPlayer = state.players.find(p => p.membershipId === membershipId);
    if (!foundPlayer) {
      return {};
    }
    // TODO: More violating "no sideeffects" but again, I kinda think it belongs here
    let characterData: AppCharacterType | undefined = undefined;
    if (foundPlayer.profile && selectedCharacterId) {
      characterData = getData(foundPlayer.profile, selectedCharacterId, get().manifest as AllDestinyManifestComponents);
    }
    db.AppPlayers.put({ ...foundPlayer, selectedCharacterId }, membershipId);
    return {
      players: state.players.map(player => {
        if (player.membershipId === membershipId) {
          console.log("playerStore:setPlayerCharacterId:foundPlayer");
          return {
            ...player,
            characterData,
            selectedCharacterId,
          };
        }
        return { ...player };
      })
    };
  }),

  setChatacterData: (characterData: AppCharacterType) => set(state => {
    console.log("playerStore:setChatacterData", characterData.membershipId, characterData);
    return {
      players: state.players.map(player => {
        if (player.membershipId === characterData.membershipId) {
          return {
            ...player,
            characterData,
          };
        }
        return { ...player };
      })
    };
  }),
});