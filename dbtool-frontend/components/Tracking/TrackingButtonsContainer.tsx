import { Button, Flex } from '@chakra-ui/react';
import useTrackingStore from '../../stores/useTrackingStore';
import { useTracking } from '../../hooks/useTracking';
import useCurrentConnectionStore from '../../stores/useCurrentConnectionStore';

const TrackingButtonsContainer = () => {
  const state = useTrackingStore(s => s.state);
  const toggleState = useTrackingStore(s => s.toggleState);
  const setChangeResults = useTrackingStore(s => s.setChangeResults);
  const { mutateAsync: track, isPending } = useTracking();
  const connectionStatus = useCurrentConnectionStore(s => s.connectionStatus);

  const onClick = async () => {
    if (state === 'start') {
      setChangeResults(undefined);
    }

    try {
      await track(state);
    } catch (error) {}

    toggleState();
  };

  return (
    <>
      {state === 'start' ? (
        <Flex>
          <Button onClick={onClick} isLoading={isPending} isDisabled={connectionStatus === 'disconnected'}>
            Start
          </Button>
        </Flex>
      ) : (
        <Flex>
          <Button onClick={onClick} isLoading={isPending} isDisabled={connectionStatus === 'disconnected'}>
            Stop
          </Button>
        </Flex>
      )}
    </>
  );
};

export default TrackingButtonsContainer;
