import { Box, VStack } from '@chakra-ui/react';
import { VscSearch, VscGitCompare, VscCombine, VscSettingsGear } from 'react-icons/vsc';
import NavigationItem from './NavigationItem';

export const NAV_ITEM_SIZE = '50px';

const Navigation = () => {
  return (
    <Box width={NAV_ITEM_SIZE} height="100vh" bg="gray.700">
      <VStack spacing={0}>
        <NavigationItem label="Search" href="Search" icon={VscSearch} />
        <NavigationItem label="Track" href="Track" icon={VscGitCompare} />
        {/* <NavigationItem label="ER Diagram" href="ERDiagram" icon={VscCombine} /> */}
        <NavigationItem label="Settings" href="Settings" icon={VscSettingsGear} />
      </VStack>
    </Box>
  );
};

export default Navigation;
