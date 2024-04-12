import { Flex } from '@chakra-ui/react';
import { VscEdit } from 'react-icons/vsc';
import { ColumnDetails } from '../../interfaces/Tables';
import useResultsStore from '../../stores/useResultsStore';
import useEditColumnModalStore from '../../stores/useEditColumnModalStore';
import PrimaryKeyColumnNameAndValue from '../../interfaces/PrimaryKeyColumnNameAndValue';

interface Props {
  columnName: string;
  columnDetails: ColumnDetails;
  value: any;
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

const EditColumnButton = ({ columnName, columnDetails, value, primaryKeyColumnNamesAndValues }: Props) => {
  const selectedTable = useResultsStore(s => s.selectedTable);
  const setEditDetails = useEditColumnModalStore(s => s.setEditDetails);
  const onModalOpen = useEditColumnModalStore(s => s.onModalOpen);

  const onEditClick = () => {
    setEditDetails({
      tableName: selectedTable!,
      columnName,
      value,
      columnDetails,
      primaryKeyColumnNamesAndValues,
    });

    onModalOpen();
  };

  return (
    <Flex onClick={onEditClick} cursor="pointer">
      <VscEdit color="#aaa" />
    </Flex>
  );
};

export default EditColumnButton;
