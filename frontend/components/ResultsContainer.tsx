import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  useDisclosure,
  Flex,
  Text,
} from '@chakra-ui/react';
import useResultsStore from '../stores/useResultsStore';
import CustomTd from './CustomTd';
import EditModal from './EditModal';
import JsonModal from './JsonModal';

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
              {Object.entries(resultTables[selectedTable].columns).map(
                ([columnName, columnDetails], index) => {
                  return (
                    <Th key={index}>
                      <Flex direction="column">
                        <Text size="xs">{columnName}</Text>
                        <Text size="xs" color="yellow.500">
                          {columnDetails.dataType}
                        </Text>
                      </Flex>
                    </Th>
                  );
                },
              )}
            </Tr>
          </Thead>

          <Tbody>
            {resultTables[selectedTable].rows.map((row, index) => {
              return (
                <Tr key={index}>
                  {Object.entries(resultTables[selectedTable].columns).map(
                    ([columnName, columnDetails], index) => (
                      <CustomTd
                        key={index}
                        columnName={columnName}
                        columnDetails={columnDetails}
                        value={row[columnName]}
                        onOpen={onOpen}
                        onEditOpen={onEditOpen}
                      />
                    ),
                  )}
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
