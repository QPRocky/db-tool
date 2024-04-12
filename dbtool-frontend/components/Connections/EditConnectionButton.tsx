import React from 'react';
import { VscEdit } from 'react-icons/vsc';
import { Box } from '@chakra-ui/react';
import Connection from '../../interfaces/Connection';
import useEditConnectionStore from '../../stores/useEditConnectionStore';

interface Props {
  connection: Connection;
}

const EditConnectionButton = ({ connection }: Props) => {
  const setEditConnectionItem = useEditConnectionStore(s => s.setEditConnectionItem);
  const setConnectionModalOpen = useEditConnectionStore(s => s.setConnectionModalOpen);

  const onEditClick = () => {
    setEditConnectionItem(connection);
    setConnectionModalOpen();
  };

  return (
    <Box>
      <VscEdit cursor="pointer" onClick={() => onEditClick()} />
    </Box>
  );
};

export default EditConnectionButton;
