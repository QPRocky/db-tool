import { Flex, Td } from '@chakra-ui/react';
import { VscTrash } from 'react-icons/vsc';
import useResultsStore from '../../stores/useResultsStore';
import PrimaryKeyColumnNameAndValue from '../../interfaces/PrimaryKeyColumnNameAndValue';
import useDeleteRowStore from '../../stores/useDeleteRowStore';

interface Props {
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

const DeleteTd = ({ primaryKeyColumnNamesAndValues }: Props) => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const onDeleteOpen = useResultsStore(s => s.onDeleteOpen);
  const setDeleteDetails = useDeleteRowStore(s => s.setDeleteDetails);

  const onDeleteClick = () => {
    setDeleteDetails({
      tableName: selectedTable!,
      primaryKeyColumnNamesAndValues,
    });

    onDeleteOpen();
  };

  return (
    <Td>
      <Flex onClick={onDeleteClick} cursor="pointer">
        <VscTrash color="#fff" />
      </Flex>
    </Td>
  );
};

export default DeleteTd;
