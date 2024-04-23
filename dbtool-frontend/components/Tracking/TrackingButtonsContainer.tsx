import { Button, Flex } from '@chakra-ui/react';
import useTrackingStore from '../../stores/useTrackingStore';
import { useTracking } from '../../hooks/useTracking';

const TrackingButtonsContainer = () => {
  const state = useTrackingStore(s => s.state);
  const toggleState = useTrackingStore(s => s.toggleState);
  const { mutateAsync: track, isPending } = useTracking();

  const onClick = async () => {
    try {
      await track(state);
    } catch (error) {}

    toggleState();
  };

  return (
    <>
      {state === 'start' ? (
        <Flex>
          <Button onClick={onClick} isLoading={isPending}>
            Start
          </Button>
        </Flex>
      ) : (
        <Flex>
          <Button onClick={onClick} isLoading={isPending}>
            Stop
          </Button>
        </Flex>
      )}
    </>
  );
};

export default TrackingButtonsContainer;
