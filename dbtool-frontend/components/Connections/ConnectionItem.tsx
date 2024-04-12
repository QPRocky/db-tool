import React from 'react';
import { Flex } from '@chakra-ui/react';
import Connection from '../../interfaces/Connection';
import useCurrentConnectionStore from '../../stores/useCurrentConnectionStore';
import ConnectionText from './ConnectionText';
import EditConnectionButton from './EditConnectionButton';
import DeleteConnectionButton from './DeleteConnectionButton';
import ConnectButton from './ConnectButton';
import DisconnectButton from './DisconnectButton';

interface Props {
  connection: Connection;
}

const ConnectionItem = ({ connection }: Props) => {
  const { connectionName } = connection;
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);

  return (
    <Flex justify="space-between" py={1}>
      <Flex align="center">
        <ConnectionText connectionName={connectionName} />
      </Flex>
      <Flex align="center">
        <EditConnectionButton connection={connection} />
        <DeleteConnectionButton connection={connection} />
        {activeConnection?.connectionName === connectionName ? (
          <DisconnectButton />
        ) : (
          <ConnectButton connection={connection} />
        )}
      </Flex>
    </Flex>
  );
};

export default ConnectionItem;
