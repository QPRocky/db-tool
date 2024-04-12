import { Flex, useToast } from '@chakra-ui/react';
import { VscCopy } from 'react-icons/vsc';

interface Props {
  value: any;
}

const CopyToClipboard = ({ value }: Props) => {
  const toast = useToast();

  const onClick = () => {
    navigator.clipboard.writeText(value);

    toast({
      title: 'Copied to clipboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex ml={2} onClick={onClick} cursor="pointer">
      <VscCopy color="#aaa" />
    </Flex>
  );
};

export default CopyToClipboard;
