import { Flex, Text, Input } from '@chakra-ui/react';
import useAddRowModalStore, { NewRowColumnDetails } from '../../stores/useAddRowModalStore';

interface Props {
  columnDetails: NewRowColumnDetails;
}

const InsertInput = ({ columnDetails }: Props) => {
  const updateColumn = useAddRowModalStore(s => s.updateColumn);

  return (
    <Flex direction="column">
      <Text>{columnDetails.columnName}</Text>
      <Text>{columnDetails.dataType}</Text>
      <Input value={columnDetails.columnValue} onChange={e => updateColumn(columnDetails.columnName, e.target.value)} />
    </Flex>
  );
};

export default InsertInput;
