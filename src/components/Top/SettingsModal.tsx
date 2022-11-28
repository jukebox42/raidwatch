import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean,
  onClose: () => void,
}

const SettingsModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <Text mb={1}>FYI not implemented... getting there.</Text>
          <Stack spacing={1}>
            <Checkbox>Show Player Synergy</Checkbox>
            <Checkbox>Show Breakers</Checkbox>
            <Checkbox>Show Raid Mods</Checkbox>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={1}>Save</Button>
          <Button onClick={onClose} variant="ghost">Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SettingsModal;
