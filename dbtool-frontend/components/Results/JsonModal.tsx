import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
  useToast,
} from '@chakra-ui/react';
import JsonFormatter from './JsonFormatter';
import useJsonModalStore from '../../stores/useJsonModalStore';

const JsonModal = () => {
  const jsonString = useJsonModalStore(s => s.jsonString);
  const isModalOpen = useJsonModalStore(s => s.isModalOpen);
  const onModalClose = useJsonModalStore(s => s.onModalClose);
  const toast = useToast();

  if (jsonString === '') return null;

  const json = JSON.stringify(JSON.parse(jsonString), null, 2);

  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose} size={'full'}>
      <ModalOverlay />
      <ModalContent bg="#1a1f2c">
        <ModalHeader>
          <Button
            bg="blue.700"
            onClick={() => {
              navigator.clipboard.writeText(json);
              toast({
                title: 'Copied to clipboard',
                status: 'success',
                duration: 2000,
                isClosable: true,
              });
            }}
          >
            Copy to clipboard
          </Button>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <JsonFormatter
            json={JSON.stringify(JSON.parse(json), null, 2)}
            tabWith={2}
            jsonStyle={{
              propertyStyle: { color: '#9ddbfe' },
              stringStyle: { color: '#cc8f77' },
              numberStyle: { color: '#b5cfa7' },
              booleanStyle: { color: '#569bd5' },
              braceStyle: { color: '#da70d6' },
              bracketStyle: { color: '#3f9efc' },
              nullStyle: { color: '#569bd5' },
              style: { fontSize: '12px', fontWeight: 900 },
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default JsonModal;
