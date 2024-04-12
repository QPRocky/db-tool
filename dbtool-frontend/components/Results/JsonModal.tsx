import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import JsonFormatter from './JsonFormatter';
import useResultsStore from '../../stores/useResultsStore';

const JsonModal = () => {
  const jsonString = useResultsStore(s => s.jsonString);
  const isJsonOpen = useResultsStore(s => s.isJsonOpen);
  const onJsonClose = useResultsStore(s => s.onJsonClose);

  if (jsonString === '') return null;

  const json = JSON.stringify(JSON.parse(jsonString), null, 2);

  return (
    <Modal isOpen={isJsonOpen} onClose={onJsonClose} size={'full'}>
      <ModalOverlay />
      <ModalContent bg="#1a1f2c">
        <ModalHeader></ModalHeader>
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
