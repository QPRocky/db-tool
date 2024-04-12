import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import useResultsStore from '../../stores/useResultsStore';

const AddRowButton = () => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const onAddRowOpen = useResultsStore(s => s.onAddRowOpen);

  const onClick = () => {
    onAddRowOpen();
  };

  if (!selectedTable) return null;

  return (
    <Flex m={2}>
      <Button onClick={onClick}>Add Row</Button>
    </Flex>
  );
};

export default AddRowButton;
