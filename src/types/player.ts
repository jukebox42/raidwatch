import { BungieMembershipType, DestinyComponentType, DestinyProfileResponse } from "bungie-api-ts/destiny2";
import { AppCharacterType } from "core";

export const PLAYER_LIVE_COMPONENTS = [
  DestinyComponentType.Transitory,
  // TBD maybe need?
  DestinyComponentType.CharacterActivities,
];

export const PLAYER_COMPONENTS = [
  DestinyComponentType.Profiles,
  DestinyComponentType.Characters,
  DestinyComponentType.CharacterEquipment,
  DestinyComponentType.ItemInstances,
  DestinyComponentType.ItemSockets,
  ...PLAYER_LIVE_COMPONENTS,
];

export type PlayerData = {
  // we lift this up because it will never change
  membershipId: string,
  membershipType: BungieMembershipType,
  selectedCharacterId: string,
  profile?: DestinyProfileResponse,
  characterData?: AppCharacterType,
  isEnemy?: boolean,
  loadFailed?: boolean,
};
