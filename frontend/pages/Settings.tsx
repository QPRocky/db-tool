import React, { useState } from 'react';
import { VscDebugStart, VscEdit, VscTrash, VscDebugDisconnect } from 'react-icons/vsc';
import { Flex, Text, Button, useDisclosure, Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import MainContainer from '../components/MainContainer';
import ConnectionModal from '../components/ConnectionModal';
import Connection from '../interfaces/Connection';
import usePersistConnectionsStore from '../stores/usePersistConnectionsStore ';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';

const SettingsPage: NextPage = () => {
  const connections = usePersistConnectionsStore(s => s.connections);
  const deleteConnection = usePersistConnectionsStore(s => s.deleteConnection);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editConnectionItem, setEditConnectionItem] = useState<Connection | undefined>(undefined);
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);
  const setAsDisconnected = useCurrentConnectionStore(s => s.setAsDisconnected);
  const setAsConnected = useCurrentConnectionStore(s => s.setAsConnected);

  const onEditClick = (connection: Connection) => {
    setEditConnectionItem(connection);
    onOpen();
  };

  const onCloseHandler = () => {
    setEditConnectionItem(undefined);
    onClose();
  };

  const onConnectClick = (connection: Connection) => {
    setAsConnected(connection);
  };

  const onDisconnectClick = () => {
    setAsDisconnected();
  };

  return (
    <>
      <MainContainer>
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

          <Button onClick={onOpen}>Add Connection</Button>
        </Flex>
      </MainContainer>

      <ConnectionModal
        editConnectionItem={editConnectionItem}
        isOpen={isOpen}
        onClose={onCloseHandler}
      />
    </>
  );
};

export default SettingsPage;
