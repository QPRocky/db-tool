import React from 'react';
import { Flex, Button, Textarea } from '@chakra-ui/react';
import { NextPage } from 'next';
import MainContainer from '../components/MainContainer';
import useNotesStore from '../stores/useNotesStore';

const TrackPage: NextPage = () => {
  const text = useNotesStore(s => s.text);

  return (
    <MainContainer>
      <Flex height="100vh" width="100%" direction="column" p={2}>
        <Flex mb={2}>
          <Button onClick={() => useNotesStore.setState({ text: '' })}>Clear</Button>
        </Flex>

        <Textarea
          flex="1"
          size="sm"
          resize="none"
          value={text}
          onChange={e => useNotesStore.setState({ text: e.target.value })}
        />
      </Flex>
    </MainContainer>
  );
};

export default TrackPage;
