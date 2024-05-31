import { Td } from '@chakra-ui/react';
import isJson from '../../utils/isJson';
import getTextColorForTracking from '../../utils/getTextColorForTracking';
import useJsonModalStore from '../../stores/useJsonModalStore';

interface Props {
  value: any;
}

const TrackingResultTd = ({ value }: Props) => {
  const setJsonString = useJsonModalStore(s => s.setJsonString);
  const onModalOpen = useJsonModalStore(s => s.onModalOpen);

  const isJsonString = isJson(value);

  const onClick = () => {
    if (isJsonString) {
      setJsonString(value);
      onModalOpen();
    }
  };

  return (
    <Td
      color={getTextColorForTracking(value, isJsonString)}
      maxW={'300px'}
      overflow="hidden"
      onClick={onClick}
      cursor={isJsonString ? 'pointer' : undefined}
    >
      {value === null ? 'null' : value}
    </Td>
  );
};

export default TrackingResultTd;
