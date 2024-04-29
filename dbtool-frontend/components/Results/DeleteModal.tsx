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
import { useDeleteRow } from '../../hooks/useDeleteRow';
import useDeleteRowModalStore from '../../stores/useDeleteRowModalStore';

const DeleteModal = () => {
  const deleteDetails = useDeleteRowModalStore(s => s.deleteDetails);
  const { mutateAsync: deleteRow } = useDeleteRow();
  const isModalOpen = useDeleteRowModalStore(s => s.isModalOpen);
  const onModalClose = useDeleteRowModalStore(s => s.onModalClose);

  const deleteClick = async () => {
    onModalClose();

    try {
      await deleteRow({
        tableName: deleteDetails?.tableName!,
        primaryKeyColumnNamesAndValues: deleteDetails?.primaryKeyColumnNamesAndValues!,
      });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete row?</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onModalClose}>
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

export default DeleteModal;
