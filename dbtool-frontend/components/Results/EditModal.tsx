import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Checkbox,
  Flex,
  Text,
} from '@chakra-ui/react';
import useEditColumnStore from '../../stores/useEditColumnStore';
import { useSaveColumn } from '../../hooks/useSaveColumn';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditModal = ({ isOpen, onClose }: Props) => {
  const editDetails = useEditColumnStore(s => s.editDetails);
  const setEditDetails = useEditColumnStore(s => s.setEditDetails);
  const { mutateAsync: saveColumn } = useSaveColumn();

  const saveClick = async () => {
    onClose();

    try {
      await saveColumn({
        tableName: editDetails?.tableName!,
        columnName: editDetails?.columnName!,
        value: editDetails?.value,
        primaryKeyColumnNamesAndValues: editDetails?.primaryKeyColumnNamesAndValues!,
      });
    } catch (error) {}
  };

  const setToNullClick = async () => {
    if (editDetails) {
      setEditDetails({
        ...editDetails,
        value: null,
      });
    }

    onClose();

    try {
      await saveColumn({
        tableName: editDetails?.tableName!,
        columnName: editDetails?.columnName!,
        value: null,
        primaryKeyColumnNamesAndValues: editDetails?.primaryKeyColumnNamesAndValues!,
      });
    } catch (error) {}
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editDetails) {
      setEditDetails({
        ...editDetails,
        value: e.target.value,
      });
    }
  };

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editDetails) {
      setEditDetails({
        ...editDetails,
        value: e.target.checked,
      });
    }
  };

  const renderInputByDataType = (dataType?: string) => {
    switch (dataType) {
      case 'bit':
        return <Checkbox isChecked={editDetails?.value} onChange={onCheckboxChange} />;
      default:
        return <Input value={editDetails?.value} onChange={onInputChange} />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#1a1f2c">
        <ModalHeader>Edit</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2}>{editDetails?.columnName}</Text>
          {renderInputByDataType(editDetails?.columnDetails.dataType)}
        </ModalBody>
        <ModalFooter>
          <Flex justify="space-between" flex={1}>
            <Flex>
              <Button onClick={setToNullClick} bg="blue.700">
                Set to null
              </Button>
            </Flex>
            <Flex>
              <Button mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button mr={3} onClick={saveClick} bg="green.700">
                Save
              </Button>
            </Flex>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
