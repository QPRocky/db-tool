import { Td, Flex } from '@chakra-ui/react';
import { ColumnDetails } from '../../interfaces/Tables';
import formatValue from '../../utils/formatValue';
import getTextColor from '../../utils/getTextColor';
import isJson from '../../utils/isJson';
import useResultsStore from '../../stores/useResultsStore';
import getCursor from '../../utils/getCursor';
import { useSearchByPrimaryKey } from '../../hooks/useSearchByPrimaryKey';
import { useSearchByForeignKey } from '../../hooks/useSearchByForeignKey';
import PrimaryKeyColumnNameAndValue from '../../interfaces/PrimaryKeyColumnNameAndValue';
import useJsonModalStore from '../../stores/useJsonModalStore';
import EditColumnButton from './EditColumnButton';

interface Props {
  columnName: string;
  columnDetails: ColumnDetails;
  value: any;
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

const ResultTd = ({ columnName, columnDetails, value, primaryKeyColumnNamesAndValues }: Props) => {
  const setJsonString = useJsonModalStore(s => s.setJsonString);
  const selectedTable = useResultsStore(s => s.selectedTable);
  const { mutateAsync: searchByPrimaryKey } = useSearchByPrimaryKey();
  const { mutateAsync: searchByForeignKey } = useSearchByForeignKey();
  const onModalOpen = useJsonModalStore(s => s.onModalOpen);

  const isJsonString = isJson(value);

  const onClick = async () => {
    if (isJsonString) {
      setJsonString(value);
      onModalOpen();
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

  return (
    <Td color={getTextColor(columnDetails, value, isJsonString)}>
      <Flex justify="space-between" align="center">
        <Flex maxW={'300px'} overflow="hidden" onClick={onClick} cursor={getCursor(columnDetails, isJsonString, value)}>
          {formatValue(columnDetails, value)}
        </Flex>
        {!columnDetails.isPK && (
          <Flex ml={5}>
            <EditColumnButton
              columnName={columnName}
              columnDetails={columnDetails}
              value={value}
              primaryKeyColumnNamesAndValues={primaryKeyColumnNamesAndValues}
            />
          </Flex>
        )}
      </Flex>
    </Td>
  );
};

export default ResultTd;
