import { Input, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import axios from 'axios';
import getAxiosError from '../utils/getAxiosError';
import { Tables } from '../interfaces/Tables';
import useResultsStore from '../stores/useResultsStore';

const SearchInput = () => {
  const [seachValue, setSeachValue] = useState('');
  const connectionStatus = useCurrentConnectionStore(s => s.connectionStatus);
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const setResultTables = useResultsStore(s => s.setResultTables);

  const search = async (seachValue: string) => {
    setIsLoading(true);

    try {
      const { data } = await axios.get<Tables>(
        `https://localhost:7210/Database/search?searchQuery=${seachValue}`,
        {
          headers: {
            ConnectionString: activeConnection?.connectionString,
          },
        },
      );

      setResultTables(data);
    } catch (error) {
      const errorMessage = getAxiosError(error);

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <Input
      isDisabled={connectionStatus === 'disconnected' || isLoading}
      w="full"
      value={seachValue}
      onChange={e => setSeachValue(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          if (isLoading) return;
          search(seachValue);
        }
      }}
    />
  );
};

export default SearchInput;
