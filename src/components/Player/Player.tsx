import { memo } from "react";
import { Box, useStyleConfig } from "@chakra-ui/react";

import CharacterSelector from "./Character/CharacterSelector";
import CharacterDisplay from "./Character/CharacterDisplay";
import CharacterLoading from "./Character/CharacterLoading";
import { useStore } from "hooks/useStore";
import { PlayerData } from "types/player";

type Props = {
  player: PlayerData,
}

const Player = ({ player }: Props) => {
  console.log("Player", player.membershipId, player);
  const isActivePlayer = useStore(state => state.activePlayer) === player.membershipId;

  const variant = isActivePlayer ? "watch" : player.isEnemy ? "enemy" : "ally";
  const styles = useStyleConfig("Player", { variant });

  return (
    <Box id={`player_${player.membershipId}`} __css={styles}>
      {!player.profile && <CharacterLoading />}
      {player.selectedCharacterId && player.profile && <CharacterDisplay player={player} />}
      {!player.selectedCharacterId && player.profile && <CharacterSelector player={player} />}
    </Box>
  );
}

export default memo(Player);
