import { Box, Flex, Heading, IconButton, Spacer, Text } from "@chakra-ui/react";
import { HamburgerIcon, RepeatIcon } from "@chakra-ui/icons";

import { useStore } from "hooks/useStore";

const Top = () => {
  const players = useStore(store => store.players);
  const loadingPlayers = players.length === 0 || players.filter(p => !p.profile).length > 0;
  const erasePlayerProfiles = useStore(store => store.erasePlayerProfiles)

  const onClick = () => erasePlayerProfiles();

  return (
    <Box>
      <Flex gap="2">
        <IconButton aria-label="Menu" icon={<HamburgerIcon />} />
        <Heading>Raid Watch <Text color="brand.500" as="span">BETA</Text></Heading>
        <Spacer />
        <IconButton
          isLoading={loadingPlayers}
          aria-label="Reload"
          icon={<RepeatIcon />}
          onClick={onClick}
          disabled={loadingPlayers}
        />

      </Flex>
    </Box>
  );
}

export default Top;
