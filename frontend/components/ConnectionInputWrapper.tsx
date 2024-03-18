import { Text, Flex } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  label: string;
}

const ConnectionInputWrapper = ({ children, label }: Props) => {
  return (
    <Flex flex={1} justify="space-around" mb={1}>
      <Flex flex={1} align="center">
        <Text fontSize="xs">{label}</Text>
      </Flex>
      <Flex flex={2}>{children}</Flex>
    </Flex>
  );
};

export default ConnectionInputWrapper;
