import React from 'react';
import { NextPage } from 'next';
import MainContainer from '../components/MainContainer';
import ConnectionModal from '../components/ConnectionModal';
import ConnectionsContainer from '../components/ConnectionsContainer';
import DeleteConnectionModal from '../components/DeleteConnectionModal';

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
