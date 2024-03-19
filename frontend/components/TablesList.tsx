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
      {Object.entries(resultTables).map(([tableName, tableDetails]) => (
        <Flex
          key={tableName}
          bgColor={selectedTable === tableDetails ? 'gray.600' : undefined}
          _hover={{ bgColor: 'gray.600' }}
          cursor="pointer"
          onClick={() => setSelectedTable(tableDetails)}
        >
          <Text fontSize="xs" px={2} py={1}>
            {tableName}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default TablesList;
