import React from 'react';
import { VscDebugStart } from 'react-icons/vsc';
import { Box } from '@chakra-ui/react';
import Connection from '../../interfaces/Connection';
import useCurrentConnectionStore from '../../stores/useCurrentConnectionStore';

interface Props {
  connection: Connection;
}

const ConnectButton = ({ connection }: Props) => {
  const setAsConnected = useCurrentConnectionStore(s => s.setAsConnected);

  const onConnectClick = () => {
    setAsConnected(connection);
  };

  return (
    <Box ml={2}>
      <VscDebugStart cursor="pointer" onClick={() => onConnectClick()} />
    </Box>
  );
};

export default ConnectButton;
