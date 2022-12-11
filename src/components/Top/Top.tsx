import { Box, Flex, Heading, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import { DeleteIcon, HamburgerIcon, QuestionIcon, RepeatIcon, SettingsIcon, UpDownIcon } from "@chakra-ui/icons";

import { useStore } from "hooks/useStore";
import { IS_BETA, SOURCE_URL } from "utils/constants";
import SettingsModal from "./SettingsModal";
import AboutModal from "./AboutModal";
import ResetDataModal from "./ResetDataModal";

const Top = () => {
  const players = useStore(store => store.players);
  const apiDisabled = useStore(store => store.apiDisabled);
  const loadingPlayers = players.filter(p => !p.profile).length > 0;
  const erasePlayerProfiles = useStore(store => store.erasePlayerProfiles);
  const { isOpen: settingsIsOpen, onOpen: settingsOnOpen, onClose: settingsOnClose } = useDisclosure();
  const { isOpen: aboutIsOpen, onOpen: aboutOnOpen, onClose: aboutOnClose } = useDisclosure();
  const { isOpen: resetIsOpen, onOpen: resetOnOpen, onClose: resetOnClose } = useDisclosure();

  return (
    <Box>
      <Flex gap="2">
        <Menu>
          <MenuButton 
            as={IconButton}
            aria-label="Menu"
            icon={<HamburgerIcon />}
          />
          <MenuList>
            <MenuItem icon={<SettingsIcon />} onClick={settingsOnOpen}>
              Settings
            </MenuItem>
            <MenuItem icon={<UpDownIcon />} onClick={() => window.open(SOURCE_URL, "_blank")}>
              Source <Text color="brand.500" as="span">(0.1.0)</Text>
            </MenuItem>
            <MenuItem icon={<QuestionIcon />} onClick={aboutOnOpen}>
              About
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<DeleteIcon color="red.400" />} onClick={resetOnOpen}>
              <Text color="red.400">Reset App Data</Text>
            </MenuItem>
          </MenuList>
        </Menu>
        <Heading>Raid Watch {IS_BETA && <Text color="brand.500" as="span">BETA</Text>}</Heading>
        <Spacer />
        <IconButton
          isLoading={loadingPlayers && !apiDisabled && players.length > 0}
          aria-label="Reload"
          icon={<RepeatIcon />}
          onClick={erasePlayerProfiles}
          disabled={loadingPlayers || apiDisabled || players.length === 0}
        />
      </Flex>
      <SettingsModal isOpen={settingsIsOpen} onClose={settingsOnClose} />
      <AboutModal isOpen={aboutIsOpen} onClose={aboutOnClose} />
      <ResetDataModal isOpen={resetIsOpen} onClose={resetOnClose} />
    </Box>
  );
}

export default Top;
