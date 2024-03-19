import React from 'react';
import { NextPage } from 'next';
import MainContainer from '../components/MainContainer';
import ConnectionModal from '../components/ConnectionModal';
import ConnectionsContainer from '../components/ConnectionsContainer';

const SettingsPage: NextPage = () => {
  return (
    <>
      <MainContainer>
        <ConnectionsContainer />
      </MainContainer>

      <ConnectionModal />
    </>
  );
};

export default SettingsPage;
