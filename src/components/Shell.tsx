import { useEffect, useState } from "react";
import { Alert, AlertIcon, Box, Button, Flex, Heading, Spacer, Text, useToast, VStack } from "@chakra-ui/react";
import { Icon, QuestionIcon } from "@chakra-ui/icons";
import { FaTwitter } from "react-icons/fa";
import { TwitterTimelineEmbed } from "react-twitter-embed";

import { useStore } from "hooks/useStore";
import { VERSION } from "utils/constants";

import GlobalLoader from "./GlobalLoader";
import FindPlayer from "./FindPlayer";
import Player from "./Player/Player";
import PlayerSynergy from "./Player/PlayerSynergy";
import Top from "./Top/Top";

const Shell = () => {
  const [isPlayersLoaded, setIsPlayersLoaded] = useState(false);
  const isInitialized = useStore(store => store.isInitialized);
  const manifestVersion = useStore(store => store.manifestVersion);
  const loadingMessage = useStore(store => store.loadingMessage);
  const players = useStore(store => store.players);
  const apiDisabled = useStore(store => store.apiDisabled);
  const activePlayer = useStore(store => store.activePlayer);
  const loadManifest = useStore(store => store.loadManifest);
  const loadPlayers = useStore(store => store.loadPlayers);
  const setToast = useStore(store => store.setToast);
  const toast = useToast();

  useEffect(() => {
    if (isPlayersLoaded) {
      return;
    }
    if (!isInitialized) {
      setToast(toast);
      loadManifest();
      return;
    }
    loadPlayers();
    setIsPlayersLoaded(true);
  }, [isInitialized, loadManifest, loadPlayers, isPlayersLoaded]);

  if (!isInitialized) {
    return (<GlobalLoader text={loadingMessage} />);
  }

  const handleBungieHelp = () => window.open("https://help.bungie.net", "_blank");
  const handleBungieTwitter = () => window.open("https://twitter.com/bungiehelp", "_blank");

  return (
    <>
      <Box as="header" p={1} position="fixed" w="100%" bg="brand.100" zIndex={9}>
        <Top />
      </Box>
      <Box as="main" pt="50px" pb="100px" w="100%">
        {apiDisabled && <Box pr={5} pl={5} pt={5}>
          <Alert status="error" variant="left-accent">
            <AlertIcon /> The Bungie API is down for maintenence.
          </Alert>
          <Flex mt={1} mb={5}>
            <Button leftIcon={<Icon as={FaTwitter} />} onClick={handleBungieTwitter}>@BungieHelp</Button>
            <Spacer />
            <Button leftIcon={<QuestionIcon />} onClick={handleBungieHelp}>help.bungie.net</Button>
          </Flex>
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="BungieHelp"
            options={{ height: 450 }}
            theme="dark"
            noHeader
            noFooter
            noBorders
          />
        </Box>}
        {!apiDisabled && <VStack p={1} pb="75px" align="stretch" spacing={1}>
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
