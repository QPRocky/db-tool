import React from 'react';
import { VscDebugStart, VscEdit, VscTrash, VscDebugDisconnect } from 'react-icons/vsc';
import { Flex, Text, Button, Box } from '@chakra-ui/react';
import Connection from '../interfaces/Connection';
import usePersistConnectionsStore from '../stores/usePersistConnectionsStore ';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import useEditConnectionStore from '../stores/useEditConnectionStore';

const ConnectionsContainer = () => {
  const connections = usePersistConnectionsStore(s => s.connections);
  const deleteConnection = usePersistConnectionsStore(s => s.deleteConnection);
  const setEditConnectionItem = useEditConnectionStore(s => s.setEditConnectionItem);
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);
  const setAsDisconnected = useCurrentConnectionStore(s => s.setAsDisconnected);
  const setAsConnected = useCurrentConnectionStore(s => s.setAsConnected);
  const setConnectionModalOpen = useEditConnectionStore(s => s.setConnectionModalOpen);

  const onEditClick = (connection: Connection) => {
    setEditConnectionItem(connection);
    setConnectionModalOpen();
  };

  const onConnectClick = (connection: Connection) => {
    setAsConnected(connection);
  };

  const onDisconnectClick = () => {
    setAsDisconnected();
  };

  return (
    <Flex flex={1} direction="column" maxW={'300px'} pl={2} borderWidth={2}>
      <Text fontSize="xs" py={3}>
        Connections
      </Text>

      <Flex direction="column" mb={3}>
        {connections.map(c => (
          <Flex key={c.uid} justify="space-between" py={1}>
            <Flex align="center">
              <Text
                fontSize="xs"
                color={activeConnection?.connectionName === c.connectionName ? '#0f0' : '#fff'}
              >
                {c.connectionName}
              </Text>
            </Flex>
            <Flex align="center">
              <Box>
                <VscEdit cursor="pointer" onClick={() => onEditClick(c)} />
              </Box>
              <Box ml={2}>
                <VscTrash cursor="pointer" onClick={() => deleteConnection(c)} />
              </Box>
              {activeConnection?.connectionName === c.connectionName ? (
                <Box ml={2}>
                  <VscDebugDisconnect cursor="pointer" onClick={() => onDisconnectClick()} />
                </Box>
              ) : (
                <Box ml={2}>
                  <VscDebugStart cursor="pointer" onClick={() => onConnectClick(c)} />
                </Box>
              )}
            </Flex>
          </Flex>
        ))}
      </Flex>

      <Button onClick={setConnectionModalOpen}>Add Connection</Button>
    </Flex>
  );
};

export default ConnectionsContainer;
