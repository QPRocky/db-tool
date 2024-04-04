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
} from '@chakra-ui/react';
import useEditColumn from '../stores/useEditColumn';
import { useSaveColumn } from '../hooks/useSaveColumn';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditModal = ({ isOpen, onClose }: Props) => {
  const editDetails = useEditColumn(s => s.editDetails);
  const setEditDetails = useEditColumn(s => s.setEditDetails);
  const { mutateAsync: saveColumn } = useSaveColumn();

  const saveClick = async () => {
    onClose();

    await saveColumn({
      tableName: editDetails?.tableName!,
      columnName: editDetails?.columnName!,
      value: editDetails?.value,
      primaryKeyColumnNamesAndValues: editDetails?.primaryKeyColumnNamesAndValues!,
    });
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
        <ModalHeader>
          {editDetails?.tableName} {editDetails?.columnName}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderInputByDataType(editDetails?.columnDetails.dataType)}</ModalBody>
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
