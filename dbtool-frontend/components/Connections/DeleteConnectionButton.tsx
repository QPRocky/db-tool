import React from 'react';
import { VscTrash } from 'react-icons/vsc';
import { Box } from '@chakra-ui/react';
import Connection from '../../interfaces/Connection';
import useDeleteConnectionStore from '../../stores/useDeleteConnectionStore';

interface Props {
  connection: Connection;
}

const DeleteConnectionButton = ({ connection }: Props) => {
  const setConnectionItemToDelete = useDeleteConnectionStore(s => s.setConnectionItemToDelete);
  const setDeleteConnectionModalOpen = useDeleteConnectionStore(s => s.setDeleteConnectionModalOpen);

  const onDeleteClick = () => {
    setConnectionItemToDelete(connection);
    setDeleteConnectionModalOpen();
  };

  return (
    <Box ml={2}>
      <VscTrash cursor="pointer" onClick={() => onDeleteClick()} />
    </Box>
  );
};

export default DeleteConnectionButton;
