import { Thead, Tr, Th } from '@chakra-ui/react';
import useResultsStore from '../../stores/useResultsStore';
import ResultTh from './ResultTh';

const ResultsTableHead = () => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const resultTables = useResultsStore(s => s.resultTables);

  if (!selectedTable || !resultTables) return null;

  return (
    <Thead position="sticky" top={0} zIndex="docked">
      <Tr>
        <Th />
        {Object.entries(resultTables[selectedTable].columns).map(([columnName, columnDetails], index) => (
          <ResultTh key={index} columnName={columnName} columnDetails={columnDetails} />
        ))}
      </Tr>
    </Thead>
  );
};

export default ResultsTableHead;
