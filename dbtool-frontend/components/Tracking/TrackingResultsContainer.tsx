import { Flex } from '@chakra-ui/react';
import TrackingResultsTable from './TrackingResultsTable';
import useTrackingStore from '../../stores/useTrackingStore';
import JsonModal from '../Results/JsonModal';

const TrackingResultsContainer = () => {
  const changeResults = useTrackingStore(s => s.changeResults);
  const selectedTrackingTable = useTrackingStore(s => s.selectedTrackingTable);

  if (!changeResults || !selectedTrackingTable) return null;

  return (
    <Flex direction="column" overflowX="auto">
      {changeResults.deleted[selectedTrackingTable] && (
        <TrackingResultsTable
          title="Deleted"
          titleColor="red.500"
          rows={changeResults.deleted[selectedTrackingTable].rows}
        />
      )}
      {changeResults.updated[selectedTrackingTable] && (
        <TrackingResultsTable
          title="Updated"
          titleColor="blue.500"
          rows={changeResults.updated[selectedTrackingTable].rows}
        />
      )}
      {changeResults.inserted[selectedTrackingTable] && (
        <TrackingResultsTable
          title="Inserted"
          titleColor="green.500"
          rows={changeResults.inserted[selectedTrackingTable].rows}
        />
      )}
      <JsonModal />
    </Flex>
  );
};

export default TrackingResultsContainer;
