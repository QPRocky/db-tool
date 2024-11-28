import { Input, useToast, InputGroup, IconButton, InputRightElement } from '@chakra-ui/react';
import { useState } from 'react';
import useCurrentConnectionStore from '../../stores/useCurrentConnectionStore';
import getAxiosError from '../../utils/getAxiosError';
import useResultsStore from '../../stores/useResultsStore';
import { useSeach } from '../../hooks/useSeach';
import { SearchIcon } from '@chakra-ui/icons';

const SearchInput = () => {
  const [searchValue, setSearchValue] = useState('');
  const connectionStatus = useCurrentConnectionStore(s => s.connectionStatus);
  const toast = useToast();
  const setResultTables = useResultsStore(s => s.setResultTables);
  const { refetch: search, isFetching } = useSeach(searchValue);
  const selectedTable = useResultsStore(s => s.selectedTable);
  const setSelectedTable = useResultsStore(s => s.setSelectedTable);

  const doSearch = async () => {
    if (isFetching) return;

    const { data, error } = await search();

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
  };

  return (
    <InputGroup>
      <Input
        isDisabled={connectionStatus === 'disconnected' || isFetching}
        w="full"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            doSearch();
          }
        }}
      />
      <InputRightElement>
        <IconButton aria-label="Hae" icon={<SearchIcon />} size="sm" onClick={doSearch} variant="ghost" />
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchInput;
