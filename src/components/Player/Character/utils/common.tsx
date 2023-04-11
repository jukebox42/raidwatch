import { Text } from "@chakra-ui/react";
import { DestinyCharacterComponent } from "bungie-api-ts/destiny2";

import { id, assetUrl } from "utils/common";
import { ANTI_BARRIER_ICON_URL, OVERLOAD_ICON_URL, UNSTOPPABLE_ICON_URL } from "utils/constants";

/**
 * Get the id of the character that was last online for the player.
 */
export const lastOnlineCharacterId = (characters: { [key: string]: DestinyCharacterComponent }) => {
  const sortedCharacterKeys = Object.keys(characters).sort((a: string, b: string) => {
    return (new Date(characters[a].dateLastPlayed) as any) -
           (new Date(characters[b].dateLastPlayed) as any);
  });
  if (sortedCharacterKeys.length === 0) {
    return "";
  }
  return sortedCharacterKeys[sortedCharacterKeys.length - 1];
}

/**
 * Checks if the provided character id is the last one that was online.
 */
export const isLastOnlineCharacter = (characterId: string, characters: { [key: string]: DestinyCharacterComponent }) => {
  const lastOnlineId = lastOnlineCharacterId(characters);
  return characterId === lastOnlineId;
}

/**
 * Handles formatting descriptions.
 * 
 * TODO: it's be cool if we replaced [thing] with the icon. Maybe later.
 */
export const parseDescription = (description: string): React.ReactNode[] => {
  return description.split("\n").map(d => {
    const imageStyle = "width:15px;display:inline;margin-top:2px;margin-bottom:-2px;";
    const descImg = (path: string) => `<img src="${assetUrl(path)}" style="${imageStyle}" />`;
    let desc = d
      // TODO: don't hardcode this
      .replace(/\{var:[\d]+\}/, "25")
      .replace("[Stagger]", descImg(UNSTOPPABLE_ICON_URL))
      .replace("[Disruption]", descImg(OVERLOAD_ICON_URL))
      .replace("[Shield-Piercing]", descImg(ANTI_BARRIER_ICON_URL));
    return <Text mb={1} key={id()} dangerouslySetInnerHTML={{__html: desc}}></Text>
  });
}