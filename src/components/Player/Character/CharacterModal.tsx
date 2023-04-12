import { 
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer
} from "@chakra-ui/react"
import { AppCharacterType } from "core";
import { AppBreakerType } from "core/itemTypes";
import { Items, ArtifactPerks } from "./equipment";
import { LightStat, Stats } from "./partials";

type Props = {
  isOpen: boolean,
  onClose: () => void,
  name: React.ReactNode,
  data: AppCharacterType,
  breakers: AppBreakerType[],
  isLastOnline: boolean
}

const CharacterModal = ({ isOpen, onClose, name, data }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" returnFocusOnClose={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex mb={1} direction="row">
            <Heading size="lg" noOfLines={1}>{name}</Heading>
            <Spacer />
            <LightStat stat={data.lightStat} />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Stats stats={data.stats} />
          <ArtifactPerks perks={data.artifactPerks} />
          <Items
            weapons={data.weapons}
            armors={data.armors}
            subclass={data.subclass}
            detailMode
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CharacterModal;
