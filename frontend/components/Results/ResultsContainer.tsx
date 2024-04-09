import useResultsStore from '../../stores/useResultsStore';
import EditModal from '../EditModal';
import JsonModal from '../JsonModal';
import ResultsTable from './ResultsTable';

const ResultsContainer = () => {
  const isJsonOpen = useResultsStore(s => s.isJsonOpen);
  const isEditOpen = useResultsStore(s => s.isEditOpen);
  const onJsonClose = useResultsStore(s => s.onJsonClose);
  const onEditClose = useResultsStore(s => s.onEditClose);

  return (
    <>
      <ResultsTable />
      <JsonModal isOpen={isJsonOpen} onClose={onJsonClose} />
      <EditModal isOpen={isEditOpen} onClose={onEditClose} />
    </>
  );
};

export default ResultsContainer;
