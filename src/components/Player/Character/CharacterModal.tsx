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
import { PADDING } from "context/theme";
import { AppCharacterType } from "core";
import { AppBreakerType } from "core/itemTypes";
import { Items } from "./equipment";
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
    <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex mb={PADDING} direction="row">
            <Heading size="lg" noOfLines={1}>{name}</Heading>
            <Spacer />
            <LightStat stat={data.lightStat} />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Stats stats={data.stats} />
          <Items weapons={data.weapons} armors={data.armors} subclass={data.subclass} detailMode />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CharacterModal;
