import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import useEditColumn from '../../stores/useEditColumn';
import { useSaveColumn } from '../../hooks/useSaveColumn';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteModal = ({ isOpen, onClose }: Props) => {
  const editDetails = useEditColumn(s => s.editDetails);
  //const { mutateAsync: saveColumn } = useSaveColumn();

  const deleteClick = async () => {
    onClose();

    /*try {
      await saveColumn({
        tableName: editDetails?.tableName!,
        columnName: editDetails?.columnName!,
        value: editDetails?.value,
        primaryKeyColumnNamesAndValues: editDetails?.primaryKeyColumnNamesAndValues!,
      });
    } catch (error) {}*/
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#1a1f2c">
        <ModalHeader>Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2}>{editDetails?.columnName}</Text>
          <Text>TODO DELETE WARNING</Text>
        </ModalBody>
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
