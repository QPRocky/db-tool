import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import usePersistConnectionsStore from '../../stores/usePersistConnectionsStore ';
import ConnectionItem from './ConnectionItem';
import AddConnectionButton from './AddConnectionButton';

const ConnectionsContainer = () => {
  const connections = usePersistConnectionsStore(s => s.connections);

  return (
    <Flex flex={1} direction="column" maxW={'300px'} pl={2}>
      <Text fontSize="xs" py={3}>
        Connections
      </Text>

      <Flex direction="column" mb={3}>
        {connections.map(c => (
          <ConnectionItem key={c.uid} connection={c} />
        ))}
      </Flex>

      <AddConnectionButton />
    </Flex>
  );
};

export default ConnectionsContainer;
