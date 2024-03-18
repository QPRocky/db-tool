import { Box, VStack } from '@chakra-ui/react';
import {
  VscSearch,
  VscGitCompare,
  VscCombine,
  VscSettingsGear,
} from 'react-icons/vsc';
import NavigationItem from './NavigationItem';

export const NAV_ITEM_SIZE = '50px';

const Navigation = () => {
  return (
    <Box width={NAV_ITEM_SIZE} height="100vh" bg="gray.700">
      <VStack spacing={0}>
        <NavigationItem label="Search" href="search" icon={VscSearch} />
        <NavigationItem label="Track" href="track" icon={VscGitCompare} />
        {/* <NavigationItem label="ER Diagram" href="ERDiagram" icon={VscCombine} /> */}
        <NavigationItem
          label="Settings"
          href="settings"
          icon={VscSettingsGear}
        />
      </VStack>
    </Box>
  );
};

export default Navigation;
