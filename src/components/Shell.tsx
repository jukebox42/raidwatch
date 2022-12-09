import { useEffect, useState } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

import { VERSION } from "utils/constants";
import GlobalLoader from "./GlobalLoader";
import FindPlayer from "./FindPlayer";
import Player from "./Player/Player";
import PlayerSynergy from "./Player/PlayerSynergy";
import Top from "./Top/Top";
import { useStore } from "hooks/useStore";

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
      <Box as="header" p={1} position="fixed" w="100%" bg="brand.100" zIndex={9}>
        <Top />
      </Box>
      <Box as="main" pt="50px" pb="100px" w="100%">
        <VStack p={1} pb="75px" align="stretch" spacing={1}>
          {players.length > 0 && <PlayerSynergy />}
          {players.map(player => {
            return (
              <Player key={player.membershipId} player={player} />
            );
          })}
          {players.length === 0 && <Box pr={30} pl={30} pt={50} textAlign="center">
            <Heading size="lg" mb={3}>
              Welcome to Raid Watch <Text color="brand.500" as="span">BETA</Text>
            </Heading>
            <Text size="md" mb={3}>
              A tool to give fireteam members quick information about their
              loadouts and how they work with others in the fireteam.
            </Text>
            <Text size="md">
              This tool is in <Text color="brand.500" as="span">BETA</Text>, things may not work.
            </Text>
          </Box>}
        </VStack>
      </Box>
      <Box as="footer" p={1} position="fixed" bottom="0" w="100%" bg="brand.100">
        {activePlayer === "" && <FindPlayer />}
        <Text align="center" fontSize="sm">v{VERSION} - {manifestVersion}</Text>
      </Box>
    </>
  );
}

export default Shell;
