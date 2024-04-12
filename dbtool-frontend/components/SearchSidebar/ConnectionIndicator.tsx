import { Text } from '@chakra-ui/react';
import useCurrentConnectionStore from '../../stores/useCurrentConnectionStore';

const ConnectionIndicator = () => {
  const connectionStatus = useCurrentConnectionStore(s => s.connectionStatus);
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);

  return (
    <Text fontSize="xs" px={2} py={1} as="b" mb={3}>
      {connectionStatus === 'connected' ? 'Connected: ' + activeConnection?.connectionName : 'No connection'}
    </Text>
  );
};

export default ConnectionIndicator;
