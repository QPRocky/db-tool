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
import useDeleteRowStore from '../../stores/useDeleteRowStore';

const DeleteModal = () => {
  const deleteDetails = useDeleteRowStore(s => s.deleteDetails);
  const { mutateAsync: deleteRow } = useDeleteRow();
  const isDeleteOpen = useDeleteRowStore(s => s.isDeleteOpen);
  const onDeleteClose = useDeleteRowStore(s => s.onDeleteClose);

  const deleteClick = async () => {
    onDeleteClose();

    try {
      await deleteRow({
        tableName: deleteDetails?.tableName!,
        primaryKeyColumnNamesAndValues: deleteDetails?.primaryKeyColumnNamesAndValues!,
      });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
      <ModalOverlay />
      <ModalContent bg="#1a1f2c">
        <ModalHeader>Delete row?</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onDeleteClose}>
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
