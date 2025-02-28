import { useEffect } from 'react';
import { Button, Box, HStack } from '@chakra-ui/react';
import useResultsStore from '../../stores/useResultsStore';
import { ROWS_PER_PAGE } from '../../stores/useResultsStore';

const Paginate = () => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const resultTables = useResultsStore(s => s.resultTables);
  const currentPage = useResultsStore(s => s.currentPage);
  const setCurrentPage = useResultsStore(s => s.setCurrentPage);
  const setCurrentRows = useResultsStore(s => s.setCurrentRows);

  useEffect(() => {
    if (selectedTable && resultTables) {
      const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
      const endIndex = startIndex + ROWS_PER_PAGE;
      setCurrentRows(resultTables[selectedTable].rows.slice(startIndex, endIndex));
    }
  }, [selectedTable, resultTables, currentPage, ROWS_PER_PAGE]);

  if (!selectedTable || !resultTables) return null;

  const totalPages = Math.ceil(resultTables[selectedTable].rows.length / ROWS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (totalPages === 1) return null;

  return (
    <Box my={4}>
      <HStack justify="center" spacing={2}>
        <Button onClick={() => handlePageChange(currentPage - 1)} isDisabled={currentPage === 1}>
          {'<'}
        </Button>
        {[...Array(totalPages)].map((_, pageIndex) => (
          <Button
            key={pageIndex}
            onClick={() => handlePageChange(pageIndex + 1)}
            variant={currentPage === pageIndex + 1 ? 'solid' : 'outline'}
          >
            {pageIndex + 1}
          </Button>
        ))}
        <Button onClick={() => handlePageChange(currentPage + 1)} isDisabled={currentPage === totalPages}>
          {'>'}
        </Button>
      </HStack>
    </Box>
  );
};

export default Paginate;
