import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ConnectionInputWrapper from './ConnectionInputWrapper';
import ConnectionType from '../../interfaces/ConnectionType';
import getAxiosError from '../../utils/getAxiosError';
import usePersistConnectionsStore from '../../stores/usePersistConnectionsStore ';
import { v4 as uuidv4 } from 'uuid';
import useEditConnectionStore from '../../stores/useEditConnectionStore';
import { useTestConnection } from '../../hooks/useTestConnection';

const ConnectionModal = () => {
  const saveConnection = usePersistConnectionsStore(s => s.saveConnection);
  const [connectionType, setConnectionType] = useState<ConnectionType>('mssql');
  const [connectionName, setConnectionName] = useState('');
  const [connectionString, setConnectionString] = useState('');
  const toast = useToast();
  const isConnectionModalOpen = useEditConnectionStore(s => s.isConnectionModalOpen);
  const setConnectionModalClose = useEditConnectionStore(s => s.setConnectionModalClose);
  const editConnectionItem = useEditConnectionStore(s => s.editConnectionItem);
  const { refetch: testConnection, isFetching } = useTestConnection(connectionString);

  useEffect(() => {
    if (editConnectionItem) {
      setConnectionType(editConnectionItem.connectionType);
      setConnectionName(editConnectionItem.connectionName);
      setConnectionString(editConnectionItem.connectionString);
    }
  }, [editConnectionItem]);

  const saveConnectionClick = () => {
    saveConnection({
      uid: editConnectionItem?.uid ?? uuidv4(),
      connectionType,
      connectionName,
      connectionString,
    });

    onCloseHandler();
  };

  const onCloseHandler = () => {
    setConnectionType('mssql');
    setConnectionName('');
    setConnectionString('');

    setConnectionModalClose();
  };

  const isButtonsDisabled = () => {
    return connectionName === '' || connectionString === '';
  };

  const testConnectionClick = async () => {
    const { error } = await testConnection();

    toast({
      title: error ? 'Connection Failed' : 'Connection Successful',
      description: error ? getAxiosError(error) : '',
      status: error ? 'error' : 'success',
      duration: error ? 10000 : 3000,
      isClosable: true,
    });
  };

  const options: { value: ConnectionType; label: string }[] = [
    { value: 'mssql', label: 'Microsoft SQL Server' },
    //{ value: 'pg', label: 'PostgreSQL' },
  ];

  return (
    <Modal isOpen={isConnectionModalOpen} onClose={onCloseHandler} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{editConnectionItem ? 'Edit connection' : 'Add connection'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ConnectionInputWrapper label={'Connection type'}>
            <Select
              value={connectionType}
              onChange={e => {
                const connectionType = e.target.value as ConnectionType;
                setConnectionType(connectionType);
              }}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </ConnectionInputWrapper>

          <ConnectionInputWrapper label={'Name'}>
            <Input value={connectionName} onChange={e => setConnectionName(e.target.value)} />
          </ConnectionInputWrapper>
          <ConnectionInputWrapper label={'Connection string'}>
            <Input value={connectionString} onChange={e => setConnectionString(e.target.value)} />
          </ConnectionInputWrapper>
        </ModalBody>

        <ModalFooter>
          <Flex justify="space-between" flex={1}>
            <Button
              isLoading={isFetching}
              isDisabled={isButtonsDisabled()}
              variant="outline"
              onClick={testConnectionClick}
              bg="blue.700"
            >
              Test connection
            </Button>
            <Button isDisabled={isButtonsDisabled()} variant="outline" onClick={saveConnectionClick} bg="green.700">
              Save
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConnectionModal;
