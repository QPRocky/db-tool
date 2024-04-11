import { Flex } from '@chakra-ui/react';
import Navigation from './Navigation';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const MainContainer = ({ children }: Props) => {
  return (
    <Flex h="100vh">
      <Navigation />
      {children}
    </Flex>
  );
};

export default MainContainer;
