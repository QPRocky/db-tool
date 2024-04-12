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
import useAddRowModalStore from '../../stores/useAddRowModalStore';

const AddRowModal = () => {
  const isModalOpen = useAddRowModalStore(s => s.isModalOpen);
  const onModalClose = useAddRowModalStore(s => s.onModalClose);

  const addClick = async () => {
    onModalClose();

    /*try {
      await deleteRow({
        tableName: deleteDetails?.tableName!,
        primaryKeyColumnNamesAndValues: deleteDetails?.primaryKeyColumnNamesAndValues!,
      });
    } catch (error) {}*/
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose}>
      <ModalOverlay />
      <ModalContent bg="#1a1f2c">
        <ModalHeader>Add row</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onModalClose}>
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
