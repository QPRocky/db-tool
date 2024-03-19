import { Td, Flex } from '@chakra-ui/react';
import { VscEdit } from 'react-icons/vsc';
import { ColumnDetails } from '../interfaces/Tables';
import formatValue from '../utils/formatValue';
import getTextColor from '../utils/getTextColor';
import isJson from '../utils/isJson';
import useResultsStore from '../stores/useResultsStore';
import getCursor from '../utils/getCursor';

interface Props {
  columnName: string;
  columnDetails: ColumnDetails;
  value: any;
  onOpen: () => void;
  onEditOpen: () => void;
}

const CustomTd = ({ columnName, columnDetails, value, onOpen, onEditOpen }: Props) => {
  const setJsonString = useResultsStore(s => s.setJsonString);
  const selectedTable = useResultsStore(s => s.selectedTable);

  const isJsonString = isJson(value);

  const onClick = async () => {
    if (isJsonString) {
      setJsonString(value);
      onOpen();
    }

    if (columnDetails.isPK) {
      console.log(selectedTable);
      console.log(columnName);
      console.log(value);
    }

    if (columnDetails.fkDetails) {
      console.log(columnDetails.fkDetails.referenceTableName);
      console.log(columnDetails.fkDetails.referenceColumnName);
      console.log(value);
    }
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
