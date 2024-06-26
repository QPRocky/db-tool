import { Flex, Text, Input, Spacer } from '@chakra-ui/react';
import useAddRowModalStore, { NewRowColumnDetails } from '../../stores/useAddRowModalStore';

interface Props {
  columnDetails: NewRowColumnDetails;
}

const InsertInput = ({ columnDetails }: Props) => {
  const updateColumn = useAddRowModalStore(s => s.updateColumn);

  return (
    <Flex direction="column" mb={3}>
      <Flex mb={1}>
        <Flex>
          <Text fontSize="xs">{columnDetails.columnName}</Text>
          <Text fontSize="xs" color="yellow.500" ml={1}>
            {columnDetails.dataType}
          </Text>
        </Flex>
        <Spacer />
        {!columnDetails.isNullable && (
          <Text fontSize="xs" color="red.500" ml={1}>
            Required
          </Text>
        )}
      </Flex>

      <Input value={columnDetails.columnValue} onChange={e => updateColumn(columnDetails.columnName, e.target.value)} />
    </Flex>
  );
};

export default InsertInput;
