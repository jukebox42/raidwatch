import { useState } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";

import { lastOnlineCharacterId } from "./utils/common";
import Emblem from "./partials/Emblem";
import { useStore } from "hooks/useStore";
import { PlayerData } from "types/player";
import { PADDING } from "context/theme";

interface Props {
  player: PlayerData;
}

const CharacterSelector = ({ player }: Props) => {
  const setPlayerCharacterId = useStore(store => store.setPlayerCharacterId);
  const [selecting, setSelecting] = useState(false);

  if (!player.profile || !player.profile.characters.data) {
    return <>No guardians. huh?</>;
  }
  const userInfo = player.profile.profile.data?.userInfo;
  const characters = player.profile.characters.data;
  const lastOnlineId = lastOnlineCharacterId(characters);

  const handleBadgeClick = (characterId: string) => {
    // prevent double taps
    if (selecting) {
      return
    }
    setSelecting(true);
    setPlayerCharacterId(player.membershipId, characterId);
  }

  return (
    <Box p={PADDING}>
      <Heading size="md">{userInfo?.bungieGlobalDisplayName}#{userInfo?.bungieGlobalDisplayNameCode}</Heading>
      <Flex mt={PADDING} justify="space-around">
        {Object.keys(characters).map(characterId => (
          <Emblem
            key={characterId}
            path={characters[characterId].emblemPath}
            onClick={() => handleBadgeClick(characterId)}
            isOnline={lastOnlineId === characterId}
            classType={characters[characterId].classType}
          />
        ))}
      </Flex>
    </Box>
  );
}

export default CharacterSelector;
