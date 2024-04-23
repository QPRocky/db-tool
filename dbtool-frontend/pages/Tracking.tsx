import React, { useState, useEffect } from 'react';
import { Flex, Input, Button, Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import MainContainer from '../components/MainContainer';
import { Resplit } from 'react-resplit';
import ResultsContainer from '../components/Results/ResultsContainer';
import ConnectionIndicator from '../components/SearchSidebar/ConnectionIndicator';
import SearchInput from '../components/SearchSidebar/SearchInput';
import TablesList from '../components/SearchSidebar/TablesList';
import Splitter from '../components/Splitter';
import TrackingButtonsContainer from '../components/Tracking/TrackingButtonsContainer';

const TrackingPage: NextPage = () => {
  return (
    <MainContainer>
      <Resplit.Root style={{ flex: 1 }}>
        <Resplit.Pane order={0} initialSize="0.2fr" minSize="0.2fr">
          <Flex direction="column" h="100vh" py={2}>
            <Box px={2}>
              <TrackingButtonsContainer />
            </Box>
            <p>TablesList</p>
          </Flex>
        </Resplit.Pane>
        <Splitter />
        <Resplit.Pane order={2} initialSize="0.8fr">
          <Flex h="100vh">
            <p>ResultsContainer</p>
          </Flex>
        </Resplit.Pane>
      </Resplit.Root>
    </MainContainer>
  );
};

export default TrackingPage;
