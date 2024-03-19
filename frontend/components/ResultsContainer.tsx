import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  TableContainer,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import useResultsStore from '../stores/useResultsStore';
import CustomTd from './CustomTd';
import EditModal from './EditModal';
import JsonModal from './JsonModal';
// import JsonModal from '../JsonModal';
// import useDbDataStore from '../../store/useDbDataStore';
// import DynamicDatabaseData from '../../../interfaces/DynamicDatabaseData';
// import CenterTd from './CenterTd';
// import EditModal from '../EditModal';

const ResultsContainer = () => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  /*const columnNames = useDbDataStore(s => s.columnNames);
  const tableData = useDbDataStore(s => s.tableData);
  const setDbData = useDbDataStore(s => s.setDbData);
  const setSelectedTable = useDbDataStore(s => s.setSelectedTable);
  const toast = useToast();

  useEffect(() => {
    const removeTrackListener = window.ipc.on('getTables', (args: DynamicDatabaseData) => {
      if (Object.keys(args).length > 0) {
        setDbData(args);
        setSelectedTable(Object.keys(args)[0]);
      } else {
        toast({
          title: 'No foreign objects found',
          description: 'No foreign objects found',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    });

    return () => {
      removeTrackListener();
    };
  }, []);*/

  if (!selectedTable) return null;

  return (
    <>
      <TableContainer overflowY="auto">
        <Table>
          <Thead position="sticky" top={0} zIndex="docked">
            <Tr>
              {Object.keys(selectedTable?.columns).map(columnName => {
                return <Th key={columnName}>{columnName}</Th>;
              })}
            </Tr>
          </Thead>

          <Tbody>
            {selectedTable.rows.map((row, index) => {
              return (
                <Tr key={index}>
                  {Object.entries(selectedTable.columns).map(
                    ([columnName, columnDetails], index) => (
                      <CustomTd
                        key={`${index}-${columnName}`}
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
