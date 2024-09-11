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
  Textarea,
} from '@chakra-ui/react';
import useEditColumnModalStore from '../../stores/useEditColumnModalStore';
import { useSaveColumn } from '../../hooks/useSaveColumn';
import isJson from '../../utils/isJson';

const EditModal = () => {
  const editDetails = useEditColumnModalStore(s => s.editDetails);
  const setEditDetails = useEditColumnModalStore(s => s.setEditDetails);
  const { mutateAsync: saveColumn } = useSaveColumn();
  const isModalOpen = useEditColumnModalStore(s => s.isModalOpen);
  const onModalClose = useEditColumnModalStore(s => s.onModalClose);

  const isJsonString = isJson(editDetails?.value);

  const saveClick = async () => {
    try {
      await saveColumn({
        tableName: editDetails?.tableName!,
        columnName: editDetails?.columnName!,
        value: editDetails?.value,
        primaryKeyColumnNamesAndValues: editDetails?.primaryKeyColumnNamesAndValues!,
      });

      onModalClose();
    } catch (error) {}
  };

  const setToNullClick = async () => {
    if (editDetails) {
      setEditDetails({
        ...editDetails,
        value: null,
      });
    }

    try {
      await saveColumn({
        tableName: editDetails?.tableName!,
        columnName: editDetails?.columnName!,
        value: null,
        primaryKeyColumnNamesAndValues: editDetails?.primaryKeyColumnNamesAndValues!,
      });

      onModalClose();
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

  const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editDetails) {
      setEditDetails({
        ...editDetails,
        value: e.target.value,
      });
    }
  };

  const renderInputByDataType = (dataType?: string) => {
    switch (dataType) {
      case 'bit':
        return <Checkbox isChecked={editDetails?.value} onChange={onCheckboxChange} />;
      case 'json':
        return <Textarea value={editDetails?.value} onChange={onTextareaChange} rows={10} />;
      default:
        return <Input value={editDetails?.value} onChange={onInputChange} />;
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose} size={isJsonString ? 'xl' : 'md'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2}>{editDetails?.columnName}</Text>
          {renderInputByDataType(isJsonString ? 'json' : editDetails?.columnDetails.dataType)}
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
