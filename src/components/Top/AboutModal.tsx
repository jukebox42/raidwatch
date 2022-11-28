import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean,
  onClose: () => void,
}

const AboutModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About</ModalHeader>
        <ModalBody>
          <Text mb={2}>Raidwatch is a tool to give fireteam members quick information about their loadouts.</Text>
          <Text mb={2}>It was made mostly for fun but if you find bugs feel free to file them on the github issues page.</Text>
          <Text>Created by PlasmaticSpoon.</Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="ghost">Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AboutModal;
