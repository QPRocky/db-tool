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
import useEditColumn from '../stores/useEditColumn';
import { useSaveColumn } from '../hooks/useSaveColumn';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditModal = ({ isOpen, onClose }: Props) => {
  const editDetails = useEditColumn(s => s.editDetails);
  const { mutateAsync: saveColumn } = useSaveColumn();

  const saveClick = async () => {
    await saveColumn({
      tableName: editDetails?.tableName!,
      columnName: editDetails?.columnName!,
      value: editDetails?.value,
      dataType: editDetails?.columnDetails.dataType!,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#1a1f2c">
        <ModalHeader>
          {editDetails?.tableName} {editDetails?.columnName}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>{editDetails?.value}</p>
          <p>{editDetails?.columnDetails.dataType}</p>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveClick}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
