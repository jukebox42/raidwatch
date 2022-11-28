import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import db from "store/db";

type Props = {
  isOpen: boolean,
  onClose: () => void,
}

const ResetDataModal = ({ isOpen, onClose }: Props) => {
  const handleDelete = async () => {
    await db.clearAllCache();
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are You Sure?</ModalHeader>
        <ModalBody>
          This will delete all cached data, reload the destiny database, and clear all guardians.
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={1} onClick={handleDelete}>Yes, Delete</Button>
          <Button onClick={onClose} variant="ghost">No</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ResetDataModal;
