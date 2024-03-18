import React from 'react';
import { NextPage } from 'next';
import MainContainer from '../components/MainContainer';
import ConnectionModal from '../pageComponents/settings/ConnectionModal';
import ConnectionsContainer from '../pageComponents/settings/ConnectionsContainer';

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
