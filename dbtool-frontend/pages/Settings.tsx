import React from 'react';
import { NextPage } from 'next';
import MainContainer from '../components/MainContainer';
import ConnectionModal from '../components/Connections/ConnectionModal';
import ConnectionsContainer from '../components/Connections/ConnectionsContainer';
import DeleteConnectionModal from '../components/Connections/DeleteConnectionModal';

const SettingsPage: NextPage = () => {
  return (
    <>
      <MainContainer>
        <ConnectionsContainer />
      </MainContainer>

      <ConnectionModal />
      <DeleteConnectionModal />
    </>
  );
};

export default SettingsPage;
