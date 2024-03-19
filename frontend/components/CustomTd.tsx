import { Td, Flex, useToast } from '@chakra-ui/react';
import { VscEdit } from 'react-icons/vsc';
import { ColumnDetails, Tables } from '../interfaces/Tables';
import formatValue from '../utils/formatValue';
import getTextColor from '../utils/getTextColor';
import isJson from '../utils/isJson';
import useResultsStore from '../stores/useResultsStore';
import getCursor from '../utils/getCursor';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import getAxiosError from '../utils/getAxiosError';

interface Props {
  columnName: string;
  columnDetails: ColumnDetails;
  value: any;
  onOpen: () => void;
  onEditOpen: () => void;
}

const CustomTd = ({ columnName, columnDetails, value, onOpen, onEditOpen }: Props) => {
  const setJsonString = useResultsStore(s => s.setJsonString);
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);
  const toast = useToast();
  const setResultTables = useResultsStore(s => s.setResultTables);
  const selectedTable = useResultsStore(s => s.selectedTable);

  const isJsonString = isJson(value);

  const onClick = async () => {
    if (isJsonString) {
      setJsonString(value);
      onOpen();
    }

    //kun klikataan FK, haetaan vaan yks taulu
    console.log(selectedTable, columnName, columnDetails, value);

    /*if (columnDetails.isPK || columnDetails.fkDetails) {
      try {
        const { data } = await axios.get<Tables>(
          `https://localhost:7210/Database/search?searchQuery=${value}`,
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
    }*/
  };

  const onEditClick = () => {
    onEditOpen();
  };

  return (
    <Td color={getTextColor(columnDetails, value, isJsonString)}>
      <Flex justify="space-between" align="center">
        <Flex
          maxW={'300px'}
          overflow="hidden"
          onClick={onClick}
          cursor={getCursor(columnDetails, isJsonString, value)}
        >
          {formatValue(columnDetails, value)}
        </Flex>
        {!columnDetails.isPK && (
          <Flex ml={2} onClick={onEditClick} cursor="pointer">
            <VscEdit color="#aaa" />
          </Flex>
        )}
      </Flex>
    </Td>
  );
};

export default CustomTd;
