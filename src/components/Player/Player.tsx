import { memo } from "react";
import { Box, useStyleConfig } from "@chakra-ui/react";

import { useStore } from "hooks/useStore";
import { PlayerData } from "types/player";

import CharacterSelector from "./Character/CharacterSelector";
import CharacterDisplay from "./Character/CharacterDisplay";
import CharacterLoading from "./Character/CharacterLoading";
import CharacterFailed from "./Character/CharacterFailed";

type Props = {
  player: PlayerData,
}

const Player = ({ player }: Props) => {
  console.log("Player", player.membershipId, player);
  const isActivePlayer = useStore(state => state.activePlayer) === player.membershipId;

  const variant = isActivePlayer ? "watch" : player.isEnemy ? "enemy" : "ally";
  const styles = useStyleConfig("Player", { variant });

  let playerDisplay = <CharacterDisplay player={player} />;
  if (player.loadFailed) {
    playerDisplay = <CharacterFailed player={player} />;
  } else if (
    (!player.profile && !player.characterData) || 
    ((!player.profile || !player.characterData) && player.selectedCharacterId)
  ) {
    playerDisplay = <CharacterLoading player={player} />;
  } else if (!player.selectedCharacterId) {
    playerDisplay = <CharacterSelector player={player} />;
  }

  return (
    <Box id={`player_${player.membershipId}`} __css={styles}>
      {playerDisplay}
    </Box>
  );
}

export default memo(Player);
