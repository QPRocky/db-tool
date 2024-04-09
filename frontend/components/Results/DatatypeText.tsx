import { Text } from '@chakra-ui/react';
interface Props {
  dataType: string;
}

const DatatypeText = ({ dataType }: Props) => {
  return (
    <Text size="xs" color="yellow.500">
      {dataType}
    </Text>
  );
};

export default DatatypeText;
