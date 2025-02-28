import { Tbody, Tr } from '@chakra-ui/react';
import useResultsStore from '../../stores/useResultsStore';
import ResultTd from './ResultTd';
import DeleteTd from './DeleteTd';
import { ROWS_PER_PAGE } from '../../stores/useResultsStore';

const ResultsTableBody = () => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const resultTables = useResultsStore(s => s.resultTables);
  const currentPage = useResultsStore(s => s.currentPage);
  const currentRows = useResultsStore(s => s.currentRows);

  if (!selectedTable || !resultTables) return null;

  return (
    <Tbody>
      {currentRows.map((row, index) => {
        const primaryKeyColumnNamesAndValues = Object.entries(resultTables[selectedTable].columns)
          .filter(([columnName, columnDetails]) => columnDetails.isPK)
          .map(([columnName]) => {
            return {
              columnName,
              value: row[columnName],
            };
          });

        return (
          <Tr key={index}>
            <DeleteTd
              index={(currentPage - 1) * ROWS_PER_PAGE + index + 1}
              primaryKeyColumnNamesAndValues={primaryKeyColumnNamesAndValues}
            />
            {Object.entries(resultTables[selectedTable].columns).map(([columnName, columnDetails], colIndex) => (
              <ResultTd
                key={colIndex}
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
