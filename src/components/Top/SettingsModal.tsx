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
  Text,
} from "@chakra-ui/react";
import { useStore } from "hooks/useStore";

type Props = {
  isOpen: boolean,
  onClose: () => void,
}

const SettingsModal = ({ isOpen, onClose }: Props) => {
  // TODO: Do this again, it's a mess
  const settings = useStore(store => store.settings);
  const toggleSetting = useStore(store => store.toggleSetting);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <Text mb={1}>FYI not implemented... getting there.</Text>
          <Stack spacing={1}>

            <Heading size="sm">Synergy</Heading>
            <Checkbox isChecked={settings.hideSynergy} onChange={() => toggleSetting("hideSynergy")}>
              Hide Player Synergy
            </Checkbox>
            <Stack pl={6} mt={1} spacing={1} pb={2}>
              <Checkbox isChecked={settings.hideSynergyActivity} onChange={() => toggleSetting("hideSynergyActivity")} disabled={settings.hideSynergy}>
                Hide Activity Selector
              </Checkbox>
            </Stack>

            <Heading size="sm">Mods</Heading>
            <Checkbox isChecked={settings.hideAnalyzeMods} onChange={() => toggleSetting("hideAnalyzeMods")}>
              Hide Character Mod Analyzer
            </Checkbox>
            <Stack pl={6} mt={1} spacing={1} pb={2}>
              <Checkbox isChecked={settings.hideAmmoFinderMods} onChange={() => toggleSetting("hideAmmoFinderMods")} disabled={settings.hideAnalyzeMods}>
                Hide Ammo Finder Mods
              </Checkbox>
              <Checkbox isChecked={settings.hideAmmoScavengerMods} onChange={() => toggleSetting("hideAmmoScavengerMods")} disabled={settings.hideAnalyzeMods}>
                Hide Ammo Scavenger Mods
              </Checkbox>
              <Checkbox isChecked={settings.hideChampionMods} onChange={() => toggleSetting("hideChampionMods")} disabled={settings.hideAnalyzeMods}>
                Hide Champion Mods
              </Checkbox>
              <Checkbox isChecked={settings.hideChargedWithLightMods} onChange={() => toggleSetting("hideChargedWithLightMods")} disabled={settings.hideAnalyzeMods}>
                Hide Charged With Light Mods
              </Checkbox>
              <Checkbox isChecked={settings.hideWellMods} onChange={() => toggleSetting("hideWellMods")} disabled={settings.hideAnalyzeMods}>
                Hide Well Mods
              </Checkbox>
              {/*<Checkbox isChecked={settings.hideWarmindMods} onChange={() => toggleSetting("hideWarmindMods")} disabled={settings.hideAnalyzeMods}>
                Hide Warmind Mods
              </Checkbox>*/}
              <Checkbox isChecked={settings.hideRaidMods} onChange={() => toggleSetting("hideRaidMods")} disabled={settings.hideAnalyzeMods}>
                Hide Raid Mods
              </Checkbox>
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
