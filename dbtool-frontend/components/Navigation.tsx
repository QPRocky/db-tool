import { Box, VStack } from '@chakra-ui/react';
import { VscSearch, VscGitCompare, VscNote, VscSettingsGear } from 'react-icons/vsc';
import NavigationItem from './NavigationItem';

export const NAV_ITEM_SIZE = '50px';

const Navigation = () => {
  return (
    <Box width={NAV_ITEM_SIZE} height="100vh" bg="gray.700">
      <VStack spacing={0}>
        <NavigationItem label="Search" href="Search" icon={VscSearch} />
        <NavigationItem label="Tracking" href="Tracking" icon={VscGitCompare} />
        <NavigationItem label="Notes" href="Notes" icon={VscNote} />
        <NavigationItem label="Settings" href="Settings" icon={VscSettingsGear} />
      </VStack>
    </Box>
  );
};

export default Navigation;
