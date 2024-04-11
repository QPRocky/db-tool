import { Flex, Text } from '@chakra-ui/react';
import useResultsStore from '../stores/useResultsStore';

const TablesList = () => {
  const resultTables = useResultsStore(s => s.resultTables);
  const selectedTable = useResultsStore(s => s.selectedTable);
  const setSelectedTable = useResultsStore(s => s.setSelectedTable);

  if (!resultTables) return null;

  return (
    <Flex flex="1" overflowY="auto" w="full" flexDirection="column">
      <Text py={5} fontSize="sm" px={2} as="b">
        Tables
      </Text>
      {Object.keys(resultTables).map(tableName => (
        <Flex
          key={tableName}
          bgColor={selectedTable === tableName ? 'gray.600' : undefined}
          _hover={{ bgColor: 'gray.600' }}
          cursor="pointer"
          onClick={() => setSelectedTable(tableName)}
        >
          <Text fontSize="xs" px={2} py={1} color={resultTables[tableName].rows.length === 0 ? 'gray.500' : '#fff'}>
            {tableName}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default TablesList;
