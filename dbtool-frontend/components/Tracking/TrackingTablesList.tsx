import { Flex, Text } from '@chakra-ui/react';
import useTrackingStore from '../../stores/useTrackingStore';
import getKeysFromChangeResults from '../../utils/getKeysFromChangeResults';

const TrackingTablesList = () => {
  const changeResults = useTrackingStore(s => s.changeResults);
  const selectedTrackingTable = useTrackingStore(s => s.selectedTrackingTable);
  const setSelectedTrackingTable = useTrackingStore(s => s.setSelectedTrackingTable);

  if (!changeResults) return null;

  const tableNames = getKeysFromChangeResults(changeResults);

  return (
    <Flex flex="1" overflowY="auto" w="full" flexDirection="column">
      <Text py={5} fontSize="sm" px={2} as="b">
        Tables
      </Text>
      {tableNames.length === 0 && (
        <Text fontSize="sm" px={2} as="b" color="yellow.500">
          No changes
        </Text>
      )}
      {tableNames.map(tableName => (
        <Flex
          key={tableName}
          bgColor={selectedTrackingTable === tableName ? 'gray.600' : undefined}
          _hover={{ bgColor: 'gray.600' }}
          cursor="pointer"
          onClick={() => setSelectedTrackingTable(tableName)}
        >
          <Text fontSize="xs" px={2} py={1}>
            {tableName}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default TrackingTablesList;
