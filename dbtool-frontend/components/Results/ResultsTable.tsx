import { Table, TableContainer } from '@chakra-ui/react';
import useResultsStore from '../../stores/useResultsStore';
import ResultsTableHead from './ResultsTableHead';
import ResultsTableBody from './ResultsTableBody';

const ResultsTable = () => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const resultTables = useResultsStore(s => s.resultTables);

  if (!selectedTable || !resultTables) return null;

  return (
    <TableContainer overflowY="auto">
      <Table>
        <ResultsTableHead />
        <ResultsTableBody />
      </Table>
    </TableContainer>
  );
};

export default ResultsTable;
