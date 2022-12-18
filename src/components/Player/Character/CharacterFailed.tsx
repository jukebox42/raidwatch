import { Alert, AlertIcon, Box, IconButton, Stack, Text } from "@chakra-ui/react";
import { RepeatIcon, DeleteIcon } from "@chakra-ui/icons";

import { PlayerData } from "types/player";
import { useStore } from "hooks/useStore";

type Props = {
  player: PlayerData;
}

const CharacterFailed = ({ player }: Props) => {
  const removePlayer = useStore(state => state.removePlayer);
  const loadPlayerProfile = useStore(state => state.loadPlayerProfile);

  const handleDelete = () => removePlayer(player.membershipId);
  const handleLoad = () => loadPlayerProfile(player.membershipId);

  return (
    <Box m={1}>
      <Alert status="error" variant="left-accent">
        <AlertIcon /> <Text>Player failed to load.</Text>
        <Stack mt={1} ml={10} direction="row" spacing={1} justify="right">
          <IconButton icon={<RepeatIcon />} aria-label="Retry" onClick={handleLoad} />
          <IconButton icon={<DeleteIcon /> } aria-label="Delete" onClick={handleDelete} />
        </Stack>
      </Alert>
    </Box>
  );
}

export default CharacterFailed;
