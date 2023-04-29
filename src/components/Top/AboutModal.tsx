import {
  Button,
  Divider,
  Heading,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean,
  onClose: () => void,
}

const AboutModal = ({ isOpen, onClose }: Props) => {
  const changelog = [
    {
      version: "2023.4.29-beta",
      description: "Refactor analyze to be more performant and enhance breaker detection. Will now only show mods " +
                   "that are not working (and raid mods)"
    },
    {
      version: "2023.4.21",
      description: "Fix error when loading some subclass data."
    },
    {
      version: "2023.4.11",
      description: "This version is a complete rewrite of the source to support lightfall."
    },
  ];
  return (
    <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader><Heading size="lg">About</Heading></ModalHeader>
        <ModalBody>
          <Text mb={2}>
            Raidwatch is a tool to give fireteam members quick information about their loadouts.
          </Text>
          <Text mb={2}>
            It was made mostly for fun but if you find bugs feel free to file them on the github issues page.
          </Text>
          <Text>Created by PlasmaticSpoon.</Text>
          <Divider mt={5} mb={5} />
          <Heading size="md" mb={2}>Changelog</Heading>
          <UnorderedList>
            {changelog.map(c => (
              <ListItem key={c.version}>
                <Text color="brand.500" as="strong">{c.version}</Text> - {c.description}
              </ListItem>
            ))}
          </UnorderedList>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="ghost">Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AboutModal;
