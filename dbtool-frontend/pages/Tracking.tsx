import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import MainContainer from '../components/MainContainer';
import { Resplit } from 'react-resplit';
import ConnectionIndicator from '../components/SearchSidebar/ConnectionIndicator';
import Splitter from '../components/Splitter';
import TrackingButtonsContainer from '../components/Tracking/TrackingButtonsContainer';
import TrackingTablesList from '../components/Tracking/TrackingTablesList';
import TrackingResultsContainer from '../components/Tracking/TrackingResultsContainer';

const TrackingPage: NextPage = () => {
  return (
    <MainContainer>
      <Resplit.Root style={{ flex: 1 }}>
        <Resplit.Pane order={0} initialSize="0.2fr" minSize="0.2fr">
          <Flex direction="column" h="100vh" py={2}>
            <ConnectionIndicator />
            <Box px={2}>
              <TrackingButtonsContainer />
            </Box>
            <TrackingTablesList />
          </Flex>
        </Resplit.Pane>
        <Splitter />
        <Resplit.Pane order={2} initialSize="0.8fr">
          <Flex h="100vh">
            <TrackingResultsContainer />
          </Flex>
        </Resplit.Pane>
      </Resplit.Root>
    </MainContainer>
  );
};

export default TrackingPage;
