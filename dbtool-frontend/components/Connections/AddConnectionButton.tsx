import React from 'react';
import { Button } from '@chakra-ui/react';
import useEditConnectionStore from '../../stores/useEditConnectionStore';

const AddConnectionButton = () => {
  const setConnectionModalOpen = useEditConnectionStore(s => s.setConnectionModalOpen);

  return <Button onClick={setConnectionModalOpen}>Add Connection</Button>;
};

export default AddConnectionButton;
