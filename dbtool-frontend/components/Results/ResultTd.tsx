import { Flex, Text, Tooltip, Table, Tbody, Tr, Td, TableContainer } from '@chakra-ui/react';
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
import { useState } from 'react';
import { useSearchByForeignKeyHover } from '../../hooks/useSearchByForeignKeyHover';

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
  const { mutateAsync: searchByForeignKeyHover } = useSearchByForeignKeyHover();
  const onModalOpen = useJsonModalStore(s => s.onModalOpen);
  const [tooltipRows, setTooltipRows] = useState<Record<string, any>[] | undefined>(undefined);

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

  const onMouseEnter = async (columnDetails: ColumnDetails) => {
    if (!columnDetails.fkDetails) return;

    const resultTables = await searchByForeignKeyHover({
      referenceTableName: columnDetails.fkDetails.referenceTableName,
      referenceColumnName: columnDetails.fkDetails.referenceColumnName,
      foreignKey: value,
    });

    setTooltipRows(resultTables[columnDetails.fkDetails.referenceTableName].rows);
  };

  return (
    <Td color={getTextColor(columnDetails, value, isJsonString)}>
      <Flex justify="space-between" align="center">
        <Flex
          maxW={'300px'}
          overflow="hidden"
          onClick={onClick}
          cursor={getCursor(columnDetails, isJsonString, value)}
          onMouseEnter={() => onMouseEnter(columnDetails)}
          onMouseLeave={() => setTooltipRows(undefined)}
        >
          {columnDetails.fkDetails ? (
            <Tooltip
              bg="gray.600"
              color="white"
              placement="right"
              sx={{ maxWidth: 'none' }}
              label={
                <TableContainer>
                  <Table>
                    <Tbody>
                      {tooltipRows?.map((row, rowIndex) =>
                        Object.entries(row).map(([key, value], index) => (
                          <Tr key={`${rowIndex}-${index}`}>
                            <Td>{key}</Td>
                            <Td maxWidth="700px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                              {formatValue(columnDetails, value)}
                            </Td>
                          </Tr>
                        )),
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              }
            >
              <Text fontSize="xs" color="green.500">
                {formatValue(columnDetails, value)}
              </Text>
            </Tooltip>
          ) : (
            formatValue(columnDetails, value)
          )}
        </Flex>
        {!columnDetails.isIdentity && (
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
