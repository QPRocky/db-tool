import { Flex, Td, Text } from '@chakra-ui/react';
import { VscTrash } from 'react-icons/vsc';
import useResultsStore from '../../stores/useResultsStore';
import PrimaryKeyColumnNameAndValue from '../../interfaces/PrimaryKeyColumnNameAndValue';
import useDeleteRowModalStore from '../../stores/useDeleteRowModalStore';

interface Props {
  index: number;
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

const DeleteTd = ({ index, primaryKeyColumnNamesAndValues }: Props) => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const onModalOpen = useDeleteRowModalStore(s => s.onModalOpen);
  const setDeleteDetails = useDeleteRowModalStore(s => s.setDeleteDetails);

  const onDeleteClick = () => {
    setDeleteDetails({
      tableName: selectedTable!,
      primaryKeyColumnNamesAndValues,
    });

    onModalOpen();
  };

  return (
    <Td position="sticky" left={0} zIndex={1} bg="gray.600">
      <Flex onClick={onDeleteClick} cursor="pointer" align="center" justify="space-around">
        <Text mr={1}>{index}</Text>
        <VscTrash color="#fff" />
      </Flex>
    </Td>
  );
};

export default DeleteTd;
