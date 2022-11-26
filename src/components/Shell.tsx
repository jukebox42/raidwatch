import { useEffect, useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

import { VERSION } from "utils/constants";
import GlobalLoader from "./GlobalLoader";
import FindPlayer from "./FindPlayer";
import Player from "./Player/Player";
import PlayerSynergy from "./Player/PlayerSynergy";
import Top from "./Top/Top";
import { useStore } from "hooks/useStore";
import { PADDING } from "context/theme";

const Shell = () => {
  const [isPlayersLoaded, setIsPlayersLoaded] = useState(false);
  const isInitialized = useStore(store => store.isInitialized);
  const manifestVersion = useStore(store => store.manifestVersion);
  const loadingMessage = useStore(store => store.loadingMessage);
  const players = useStore(store => store.players);
  const activePlayer = useStore(store => store.activePlayer);
  const loadManifest = useStore(store => store.loadManifest);
  const loadPlayers = useStore(store => store.loadPlayers);

  useEffect(() => {
    if (isPlayersLoaded) {
      return;
    }
    if (!isInitialized) {
      loadManifest();
      return;
    }
    loadPlayers();
    setIsPlayersLoaded(true);
  }, [isInitialized, loadManifest, loadPlayers, isPlayersLoaded]);

  if (!isInitialized) {
    return (<GlobalLoader text={loadingMessage} />);
  }

  return (
    <>
      <Box as="header" p={PADDING} position="fixed" w="100%" bg="brand.100">
        <Top />
      </Box>
      <Box as="main" pt="50px" pb="100px" w="100%">
        <VStack p={PADDING} align="stretch" spacing={PADDING}>
          {players.length > 0 && <PlayerSynergy />}
          {players.map(player => {
            return (
              <Player key={player.membershipId} player={player} />
            );
          })}
        </VStack>
      </Box>
      <Box as="footer" p={PADDING} position="fixed" bottom="0" w="100%" bg="brand.100">
        {activePlayer === "" && <FindPlayer />}
        <Text align="center">v{VERSION} - {manifestVersion}</Text>
      </Box>
    </>
  );
}

export default Shell;
