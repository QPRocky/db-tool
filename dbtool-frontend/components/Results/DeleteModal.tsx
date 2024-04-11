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

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteModal = ({ isOpen, onClose }: Props) => {
  const deleteDetails = useDeleteRowStore(s => s.deleteDetails);
  const { mutateAsync: deleteRow } = useDeleteRow();

  const deleteClick = async () => {
    onClose();

    try {
      await deleteRow({
        tableName: deleteDetails?.tableName!,
        primaryKeyColumnNamesAndValues: deleteDetails?.primaryKeyColumnNamesAndValues!,
      });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#1a1f2c">
        <ModalHeader>Delete row?</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button mr={3} onClick={deleteClick}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
