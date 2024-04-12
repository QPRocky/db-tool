import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import useResultsStore from '../../stores/useResultsStore';
import useAddRowModalStore from '../../stores/useAddRowModalStore';

const AddRowButton = () => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const onModalOpen = useAddRowModalStore(s => s.onModalOpen);

  const onClick = () => {
    onModalOpen();
  };

  if (!selectedTable) return null;

  return (
    <Flex m={2}>
      <Button onClick={onClick}>Add Row</Button>
    </Flex>
  );
};

export default AddRowButton;
