import { Flex } from '@chakra-ui/react';
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';
import JsonModal from './JsonModal';
import ResultsTable from './ResultsTable';
import AddRowButton from './AddRowButton';
import AddRowModal from './AddRowModal';

const ResultsContainer = () => {
  return (
    <Flex direction="column">
      <AddRowButton />
      <ResultsTable />
      <JsonModal />
      <EditModal />
      <DeleteModal />
      <AddRowModal />
    </Flex>
  );
};

export default ResultsContainer;
