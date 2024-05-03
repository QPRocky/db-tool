import { Text } from '@chakra-ui/react';

interface Props {
  columnName: string;
}

const ColumnNameText = ({ columnName }: Props) => {
  return <Text fontSize="xs">{columnName}</Text>;
};

export default ColumnNameText;
