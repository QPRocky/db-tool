import { Table, Thead, Tbody, Tr, Th, TableContainer, useDisclosure, Flex, Text, Box, Tooltip } from '@chakra-ui/react';
import useResultsStore from '../stores/useResultsStore';
import CustomTd from './CustomTd';
import EditModal from './EditModal';
import JsonModal from './JsonModal';
import PrimaryKeyNamesAndValue from '../interfaces/PrimaryKeyColumnNameAndValue';

const ResultsContainer = () => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const resultTables = useResultsStore(s => s.resultTables);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  if (!selectedTable || !resultTables) return null;

  return (
    <>
      <TableContainer overflowY="auto">
        <Table>
          <Thead position="sticky" top={0} zIndex="docked">
            <Tr>
              {Object.entries(resultTables[selectedTable].columns).map(([columnName, columnDetails], index) => {
                return (
                  <Th key={index}>
                    <Flex direction="column">
                      <Text size="xs">{columnName}</Text>

                      <Flex>
                        <Text size="xs" color="yellow.500">
                          {columnDetails.dataType}
                        </Text>
                        {columnDetails.isPK && (
                          <Text size="xs" color="blue.500" ml={1}>
                            PK
                          </Text>
                        )}
                        {columnDetails.fkDetails && (
                          <Tooltip
                            bg="gray.600"
                            color="green.400"
                            fontSize="xs"
                            fontWeight={900}
                            label={
                              columnDetails.fkDetails.referenceTableName +
                              ' ' +
                              columnDetails.fkDetails.referenceColumnName
                            }
                            aria-label="A tooltip"
                          >
                            <Text size="xs" color="green.500" ml={1}>
                              FK
                            </Text>
                          </Tooltip>
                        )}
                      </Flex>
                    </Flex>
                  </Th>
                );
              })}
            </Tr>
          </Thead>

          <Tbody>
            {resultTables[selectedTable].rows.map((row, index) => {
              const primaryKeyColumnNamesAndValues = Object.entries(resultTables[selectedTable].columns)
                .filter(([columnName, columnDetails]) => columnDetails.isPK)
                .map(([columnName, columnDetails]) => {
                  return {
                    columnName,
                    value: row[columnName],
                  };
                });

              return (
                <Tr key={index}>
                  {Object.entries(resultTables[selectedTable].columns).map(([columnName, columnDetails], index) => (
                    <CustomTd
                      key={index}
                      columnName={columnName}
                      columnDetails={columnDetails}
                      value={row[columnName]}
                      primaryKeyColumnNamesAndValues={primaryKeyColumnNamesAndValues}
                      onOpen={onOpen}
                      onEditOpen={onEditOpen}
                    />
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <JsonModal isOpen={isOpen} onClose={onClose} />

      <EditModal isOpen={isEditOpen} onClose={onEditClose} />
    </>
  );
};

export default ResultsContainer;
