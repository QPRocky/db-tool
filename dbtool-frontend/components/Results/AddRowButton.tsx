import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import useResultsStore from '../../stores/useResultsStore';
import useAddRowModalStore from '../../stores/useAddRowModalStore';

const AddRowButton = () => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const resultTables = useResultsStore(s => s.resultTables);
  const onModalOpen = useAddRowModalStore(s => s.onModalOpen);
  const initColumns = useAddRowModalStore(s => s.initColumns);

  const onClick = () => {
    if (!selectedTable || !resultTables) return;

    const columns = Object.entries(resultTables[selectedTable].columns)
      .filter(([_, columnDetails]) => !columnDetails.isGeneratedAlwaysType && !columnDetails.isIdentity)
      .map(([columnName, columnDetails]) => ({
        columnName,
        dataType: columnDetails.dataType,
        isNullable: columnDetails.isNullable,
        columnValue: null,
      }));

    initColumns(columns);
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
