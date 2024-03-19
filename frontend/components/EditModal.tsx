import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#1a1f2c">
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>TODO edit</p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
