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
import useResultsStore from '../../stores/useResultsStore';
import InsertInput from './InsertInput';
import { useAddRow } from '../../hooks/useAddRow';

const AddRowModal = () => {
  const isModalOpen = useAddRowModalStore(s => s.isModalOpen);
  const onModalClose = useAddRowModalStore(s => s.onModalClose);
  const selectedTable = useResultsStore(s => s.selectedTable);
  const columns = useAddRowModalStore(s => s.columns);
  const { mutateAsync: addRow } = useAddRow();

  const addClick = async () => {
    if (!selectedTable || !columns) return;

    onModalClose();

    try {
      await addRow({
        tableName: selectedTable,
        columns,
      });
    } catch (error) {}
  };

  if (!selectedTable || !columns) return null;

  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose}>
      <ModalOverlay />
      <ModalContent bg="#1a1f2c">
        <ModalHeader>Add row to {selectedTable}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {columns.map((column, index) => (
            <InsertInput key={index} columnDetails={column} />
          ))}
        </ModalBody>
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
