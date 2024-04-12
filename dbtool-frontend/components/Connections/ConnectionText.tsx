import React from 'react';
import { Text } from '@chakra-ui/react';
import useCurrentConnectionStore from '../../stores/useCurrentConnectionStore';

interface Props {
  connectionName: string;
}

const ConnectionText = ({ connectionName }: Props) => {
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);

  return (
    <Text fontSize="xs" color={activeConnection?.connectionName === connectionName ? '#0f0' : '#fff'}>
      {connectionName}
    </Text>
  );
};

export default ConnectionText;
