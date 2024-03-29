import { Box, Flex, Heading, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import { DeleteIcon, HamburgerIcon, MoonIcon, QuestionIcon, RepeatIcon, SettingsIcon, SunIcon, UpDownIcon } from "@chakra-ui/icons";

import { useStore } from "hooks/useStore";
import { BETA_URL, IS_BETA, SELF_URL, SOURCE_URL, VERSION } from "utils/constants";
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
              Source <Text color="brand.500" as="span">({VERSION})</Text>
            </MenuItem>
            <MenuItem icon={<QuestionIcon />} onClick={aboutOnOpen}>
              About
            </MenuItem>
            {!IS_BETA && <MenuItem icon={<MoonIcon color="brand.275" />} onClick={() => window.open(BETA_URL, "_self")}>
              Try the <Text color="brand.275" as="span">Beta</Text> Version
            </MenuItem>}
            {IS_BETA && <MenuItem icon={<SunIcon color="brand.375" />} onClick={() => window.open(SELF_URL, "_self")}>
              Try the <Text color="brand.375" as="span">Stable</Text> Version
            </MenuItem>}
            <MenuDivider />
            <MenuItem icon={<DeleteIcon color="red.400" />} onClick={resetOnOpen}>
              <Text color="red.400">Reset App Data</Text>
            </MenuItem>
          </MenuList>
        </Menu>
        <Heading>Raid Watch {IS_BETA && <Text color="brand.275" as="span">BETA</Text>}</Heading>
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
