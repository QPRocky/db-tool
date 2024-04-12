import React from 'react';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { Box } from '@chakra-ui/react';
import useCurrentConnectionStore from '../../stores/useCurrentConnectionStore';

const DisconnectButton = () => {
  const setAsDisconnected = useCurrentConnectionStore(s => s.setAsDisconnected);

  const onDisconnectClick = () => {
    setAsDisconnected();
  };

  return (
    <Box ml={2}>
      <VscDebugDisconnect cursor="pointer" onClick={() => onDisconnectClick()} />
    </Box>
  );
};

export default DisconnectButton;
