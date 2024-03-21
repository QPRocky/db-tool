import { Input, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import getAxiosError from '../utils/getAxiosError';
import useResultsStore from '../stores/useResultsStore';
import { useSeach } from '../hooks/useSeach';

const SearchInput = () => {
  const [searchValue, setSearchValue] = useState('');
  const connectionStatus = useCurrentConnectionStore(s => s.connectionStatus);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const setResultTables = useResultsStore(s => s.setResultTables);
  const { refetch } = useSeach(searchValue);
  const selectedTable = useResultsStore(s => s.selectedTable);
  const setSelectedTable = useResultsStore(s => s.setSelectedTable);

  const search = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const { data, error } = await refetch();

    if (data) {
      const resetSelectedTable = !selectedTable || !data || !data[selectedTable];
      if (resetSelectedTable) {
        setSelectedTable(undefined);
      }

      setResultTables(data);
    } else {
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
      value={searchValue}
      onChange={e => setSearchValue(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          search();
        }
      }}
    />
  );
};

export default SearchInput;
