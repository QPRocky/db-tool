import { Tbody, Tr } from '@chakra-ui/react';
import useResultsStore from '../../stores/useResultsStore';
import ResultTd from './ResultTd';
import DeleteTd from './DeleteTd';

const ResultsTableBody = () => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const resultTables = useResultsStore(s => s.resultTables);

  if (!selectedTable || !resultTables) return null;

  return (
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
            <DeleteTd primaryKeyColumnNamesAndValues={primaryKeyColumnNamesAndValues} />
            {Object.entries(resultTables[selectedTable].columns).map(([columnName, columnDetails], index) => (
              <ResultTd
                key={index}
                columnName={columnName}
                columnDetails={columnDetails}
                value={row[columnName]}
                primaryKeyColumnNamesAndValues={primaryKeyColumnNamesAndValues}
              />
            ))}
          </Tr>
        );
      })}
    </Tbody>
  );
};

export default ResultsTableBody;
