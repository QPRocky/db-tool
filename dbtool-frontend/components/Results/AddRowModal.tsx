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
import useResultsStore from '../../stores/useResultsStore';

const AddRowModal = () => {
  const isAddRowOpen = useResultsStore(s => s.isAddRowOpen);
  const onAddRowClose = useResultsStore(s => s.onAddRowClose);

  const addClick = async () => {
    onAddRowClose();

    /*try {
      await deleteRow({
        tableName: deleteDetails?.tableName!,
        primaryKeyColumnNamesAndValues: deleteDetails?.primaryKeyColumnNamesAndValues!,
      });
    } catch (error) {}*/
  };

  return (
    <Modal isOpen={isAddRowOpen} onClose={onAddRowClose}>
      <ModalOverlay />
      <ModalContent bg="#1a1f2c">
        <ModalHeader>Add row</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onAddRowClose}>
            Cancel
          </Button>
          <Button mr={3} onClick={addClick} bg="red.700">
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddRowModal;
