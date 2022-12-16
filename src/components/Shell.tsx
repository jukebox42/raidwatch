import { useEffect, useState } from "react";
import { Box, Heading, Text, useToast, VStack } from "@chakra-ui/react";
import shallow from "zustand/shallow";

import { useStore } from "hooks/useStore";
import { IS_BETA, VERSION } from "utils/constants";

import GlobalLoader from "./generics/GlobalLoader";
import FindPlayer from "./FindPlayer";
import Player from "./Player/Player";
import PlayerSynergy from "./Player/PlayerSynergy";
import Top from "./Top/Top";
import GlobalError from "./generics/GlobalError";

const Shell = () => {
  const [isPlayersLoaded, setIsPlayersLoaded] = useState(false);
  const {
    // keys
    isInitialized, manifestVersion, apiDisabled, loadingMessage, activePlayer,
    // functions
    loadManifest, loadPlayers, setToast, loadSettings,
  } = useStore(state => ({
    isInitialized: state.isInitialized,
    manifestVersion: state.manifestVersion,
    apiDisabled: state.apiDisabled,
    loadingMessage: state.loadingMessage,
    activePlayer: state.activePlayer,
    loadManifest: state.loadManifest,
    loadPlayers: state.loadPlayers,
    setToast: state.setToast,
    loadSettings: state.loadSettings
  }), shallow);
  const players = useStore(store => store.players);
  const settings = useStore(store => store.settings);
  const toast = useToast();

  useEffect(() => {
    if (isPlayersLoaded) {
      return;
    }
    const init = async () => {
      setToast(toast);
      await loadSettings();
      await loadManifest();
    }
    if (!isInitialized) {
      init()
      return;
    }
    loadPlayers();
    setIsPlayersLoaded(true);
  }, [isInitialized, loadManifest, loadSettings, loadPlayers, isPlayersLoaded, setToast, toast]);

  if (!isInitialized) {
    return (<GlobalLoader text={loadingMessage} />);
  }

  return (
    <>
      <Box as="header" p={1} position="fixed" w="100%" bg="brand.100" zIndex={9}>
        <Top />
      </Box>
      <Box as="main" pt="50px" pb="100px" w="100%">
        {apiDisabled && <GlobalError />}
        {!apiDisabled && <VStack p={1} pb="75px" align="stretch" spacing={1}>
          {players.length > 0 && !settings.hideSynergy && <PlayerSynergy />}
          {players.map(player => {
            return (
              <Player key={player.membershipId} player={player} />
            );
          })}
          {players.length === 0 && <Box pr={30} pl={30} pt={50} textAlign="center">
            <Heading size="lg" mb={3}>
              Welcome to Raid Watch {IS_BETA && <Text color="brand.500" as="span">BETA</Text>}
            </Heading>
            <Text size="md" mb={3}>
              A tool to give fireteam members quick information about their
              loadouts and how they work with others in the fireteam.
            </Text>
            {IS_BETA && <Text size="md">
              This tool is in <Text color="brand.500" as="span">BETA</Text>, things may not work.
            </Text>}
          </Box>}
        </VStack>}
      </Box>
      <Box as="footer" p={1} position="fixed" bottom="0" w="100%" bg="brand.100">
        {!apiDisabled && activePlayer === "" && <FindPlayer />}
        <Text align="center" fontSize="sm">v{VERSION} - {manifestVersion}</Text>
      </Box>
    </>
  );
}

export default Shell;
