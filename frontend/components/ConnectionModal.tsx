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
import ConnectionType from '../interfaces/ConnectionType';
import Connection from '../interfaces/Connection';
import axios from 'axios';
import getAxiosError from '../utils/getAxiosError';
import usePersistConnectionsStore from '../stores/usePersistConnectionsStore ';
import { v4 as uuidv4 } from 'uuid';
// import ConnectionType from '../../interfaces/ConnectionType';
// import getPort from '../utils/getPort';

interface Props {
  editConnectionItem?: Connection;
  isOpen: boolean;
  onClose: () => void;
}

const ConnectionModal = ({ editConnectionItem, isOpen, onClose }: Props) => {
  const saveConnection = usePersistConnectionsStore(s => s.saveConnection);
  const [connectionType, setConnectionType] = useState<ConnectionType>('mssql');
  const [connectionName, setConnectionName] = useState('');
  const [connectionString, setConnectionString] = useState('');
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  /*useEffect(() => {
    const removeTrackListener = window.ipc.on('testConnection', args => {
      const error = args as string

      toast({
        title: error === "" ? "Connection Successful" : "Connection Failed",
        description: error,
        status: error === "" ? "success" : "error",
        duration: 10000,
        isClosable: true
      })

      setIsLoading(false)
    });

    return () => {
      removeTrackListener();
    };
  }, [])*/

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

    onClose();
  };

  const isButtonsDisabled = () => {
    return connectionName === '' || connectionString === '';
  };

  const testConnection = async () => {
    let errorMessage = '';
    setIsLoading(true);

    try {
      const res = await axios.get('https://localhost:7210/Database/testConnection', {
        headers: {
          ConnectionString: connectionString,
        },
      });
    } catch (error) {
      errorMessage = getAxiosError(error);
    }

    toast({
      title: errorMessage === '' ? 'Connection Successful' : 'Connection Failed',
      description: errorMessage,
      status: errorMessage === '' ? 'success' : 'error',
      duration: 10000,
      isClosable: true,
    });

    setIsLoading(false);
  };

  const options: { value: ConnectionType; label: string }[] = [
    { value: 'mssql', label: 'Microsoft SQL Server' },
    //{ value: 'pg', label: 'PostgreSQL' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler} size="xl">
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
              isLoading={isLoading}
              isDisabled={isButtonsDisabled()}
              variant="outline"
              onClick={testConnection}
            >
              Test connection
            </Button>
            <Button
              isDisabled={isButtonsDisabled()}
              variant="outline"
              onClick={saveConnectionClick}
            >
              Save
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConnectionModal;
