import {
  Button,
  Checkbox,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useStore } from "hooks/useStore";

type Props = {
  isOpen: boolean,
  onClose: () => void,
}

const SettingsModal = ({ isOpen, onClose }: Props) => {
  const settings = useStore(store => store.settings);
  const toggleSetting = useStore(store => store.toggleSetting);

  const newCheckbox = (key: string, title: string, disabled: boolean = false) => (
    <Checkbox isChecked={settings[key]} onChange={() => toggleSetting(key)} disabled={disabled}>{title}</Checkbox>
  );
  {newCheckbox("", "")}
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <Stack spacing={1}>
            <Heading size="sm">Synergy</Heading>
            {newCheckbox("hideSynergy", "Hide Player Synergy")}
            <Stack pl={6} mt={1} spacing={1} pb={2}>
              {newCheckbox("hideSynergyActivity", "Hide Activity Selector", settings.hideSynergy)}
            </Stack>
            <Heading size="sm">Mods</Heading>
            {newCheckbox("hideAnalyzeMods", "Hide Character Mod Analyzer")}
            <Stack pl={6} mt={1} spacing={1} pb={2}>
              {newCheckbox("hideAmmoFinderMods", "Hide Ammo Finder Mods", settings.hideAnalyzeMods)}
              {newCheckbox("hideAnalyzeMods", "Hide Ammo Scavenger Mods", settings.hideAnalyzeMods)}
              {newCheckbox("hideChampionMods", "Hide Champion Mods", settings.hideAnalyzeMods)}
              {newCheckbox("hideChargedWithLightMods", "Hide Charged With Light Mods", settings.hideAnalyzeMods)}
              {newCheckbox("hideWellMods", "Hide Well Mods", settings.hideAnalyzeMods)}
              {newCheckbox("hideWarmindMods", "Hide Warmind Mods", settings.hideAnalyzeMods)}
              {newCheckbox("hideRaidMods", "Hide Raid Mods", settings.hideAnalyzeMods)}
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="ghost">Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SettingsModal;
