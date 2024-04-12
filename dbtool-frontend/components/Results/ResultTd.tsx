import { Td, Flex } from '@chakra-ui/react';
import { VscEdit } from 'react-icons/vsc';
import { ColumnDetails } from '../../interfaces/Tables';
import formatValue from '../../utils/formatValue';
import getTextColor from '../../utils/getTextColor';
import isJson from '../../utils/isJson';
import useResultsStore from '../../stores/useResultsStore';
import getCursor from '../../utils/getCursor';
import { useSearchByPrimaryKey } from '../../hooks/useSearchByPrimaryKey';
import { useSearchByForeignKey } from '../../hooks/useSearchByForeignKey';
import useEditColumnStore from '../../stores/useEditColumnStore';
import PrimaryKeyColumnNameAndValue from '../../interfaces/PrimaryKeyColumnNameAndValue';
import CopyToClipboard from './CopyToClipboard';

interface Props {
  columnName: string;
  columnDetails: ColumnDetails;
  value: any;
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

const ResultTd = ({ columnName, columnDetails, value, primaryKeyColumnNamesAndValues }: Props) => {
  const setJsonString = useResultsStore(s => s.setJsonString);
  const selectedTable = useResultsStore(s => s.selectedTable);
  const setEditDetails = useEditColumnStore(s => s.setEditDetails);
  const { mutateAsync: searchByPrimaryKey } = useSearchByPrimaryKey();
  const { mutateAsync: searchByForeignKey } = useSearchByForeignKey();
  const onJsonOpen = useResultsStore(s => s.onJsonOpen);
  const onEditOpen = useResultsStore(s => s.onEditOpen);

  const isJsonString = isJson(value);

  const onClick = async () => {
    if (isJsonString) {
      setJsonString(value);
      onJsonOpen();
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
    setEditDetails({
      tableName: selectedTable!,
      columnName,
      value,
      columnDetails,
      primaryKeyColumnNamesAndValues,
    });
    onEditOpen();
  };

  return (
    <Td color={getTextColor(columnDetails, value, isJsonString)}>
      <Flex justify="space-between" align="center">
        <Flex maxW={'300px'} overflow="hidden" onClick={onClick} cursor={getCursor(columnDetails, isJsonString, value)}>
          {formatValue(columnDetails, value)}
        </Flex>
        {!columnDetails.isPK && (
          <Flex>
            <CopyToClipboard value={value} />
            <Flex ml={1} onClick={onEditClick} cursor="pointer">
              <VscEdit color="#aaa" />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Td>
  );
};

export default ResultTd;
