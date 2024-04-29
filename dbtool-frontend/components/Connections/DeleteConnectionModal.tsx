import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import useDeleteConnectionStore from '../../stores/useDeleteConnectionStore';
import usePersistConnectionsStore from '../../stores/usePersistConnectionsStore ';

const DeleteConnectionModal = () => {
  const isDeleteConnectionModalOpen = useDeleteConnectionStore(s => s.isDeleteConnectionModalOpen);
  const setDeleteConnectionModalClose = useDeleteConnectionStore(s => s.setDeleteConnectionModalClose);
  const connectionItemToDelete = useDeleteConnectionStore(s => s.connectionItemToDelete);
  const deleteConnection = usePersistConnectionsStore(s => s.deleteConnection);

  const deleteClick = async () => {
    setDeleteConnectionModalClose();
    deleteConnection(connectionItemToDelete!);
  };

  return (
    <Modal isOpen={isDeleteConnectionModalOpen} onClose={setDeleteConnectionModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete connection?</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={setDeleteConnectionModalClose}>
            Cancel
          </Button>
          <Button mr={3} onClick={deleteClick} bg="red.700">
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConnectionModal;
