import { Td, Flex } from '@chakra-ui/react';
import { VscEdit } from 'react-icons/vsc';
import { ColumnDetails } from '../interfaces/Tables';
import formatValue from '../utils/formatValue';
import getTextColor from '../utils/getTextColor';
import isJson from '../utils/isJson';
import useResultsStore from '../stores/useResultsStore';
import getCursor from '../utils/getCursor';
import { useSearchByPrimaryKey } from '../hooks/useSearchByPrimaryKey';
import { useSearchByForeignKey } from '../hooks/useSearchByForeignKey';

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
  const { mutateAsync: searchByPrimaryKey } = useSearchByPrimaryKey();
  const { mutateAsync: searchByForeignKey } = useSearchByForeignKey();

  const isJsonString = isJson(value);

  const onClick = async () => {
    if (isJsonString) {
      setJsonString(value);
      onOpen();
    }

    if (columnDetails.isPK) {
      await searchByPrimaryKey({
        tableName: selectedTable!,
        columnName,
        primaryKey: value,
      });
    }

    if (columnDetails.fkDetails) {
      await searchByForeignKey({
        referenceTableName: columnDetails.fkDetails.referenceTableName,
        referenceColumnName: columnDetails.fkDetails.referenceColumnName,
        foreignKey: value,
      });
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
