import { Flex, Td, Text } from '@chakra-ui/react';

interface Props {
  index: number;
}

const IndexTd = ({ index }: Props) => {
  return (
    <Td position="sticky" left={0} zIndex={1} bg="gray.600">
      <Flex align="center" justify="space-around">
        <Text mr={1}>{index}</Text>
      </Flex>
    </Td>
  );
};

export default IndexTd;
