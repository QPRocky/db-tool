import { Flex, Td } from '@chakra-ui/react';
import { VscTrash } from 'react-icons/vsc';
import useResultsStore from '../../stores/useResultsStore';
import PrimaryKeyColumnNameAndValue from '../../interfaces/PrimaryKeyColumnNameAndValue';
import useDeleteRowModalStore from '../../stores/useDeleteRowModalStore';

interface Props {
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

const DeleteTd = ({ primaryKeyColumnNamesAndValues }: Props) => {
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
    <Td>
      <Flex onClick={onDeleteClick} cursor="pointer">
        <VscTrash color="#aaa" />
      </Flex>
    </Td>
  );
};

export default DeleteTd;
