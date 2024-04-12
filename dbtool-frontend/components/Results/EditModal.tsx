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
import useEditColumnModalStore from '../../stores/useEditColumnModalStore';
import { useSaveColumn } from '../../hooks/useSaveColumn';

const EditModal = () => {
  const editDetails = useEditColumnModalStore(s => s.editDetails);
  const setEditDetails = useEditColumnModalStore(s => s.setEditDetails);
  const { mutateAsync: saveColumn } = useSaveColumn();
  const isModalOpen = useEditColumnModalStore(s => s.isModalOpen);
  const onModalClose = useEditColumnModalStore(s => s.onModalClose);

  const saveClick = async () => {
    onModalClose();

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

    onModalClose();

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
    <Modal isOpen={isModalOpen} onClose={onModalClose}>
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
              <Button mr={3} onClick={onModalClose}>
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
