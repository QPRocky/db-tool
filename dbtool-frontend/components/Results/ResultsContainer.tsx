import useResultsStore from '../../stores/useResultsStore';
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';
import JsonModal from './JsonModal';
import ResultsTable from './ResultsTable';

const ResultsContainer = () => {
  const isJsonOpen = useResultsStore(s => s.isJsonOpen);
  const isEditOpen = useResultsStore(s => s.isEditOpen);
  const isDeleteOpen = useResultsStore(s => s.isDeleteOpen);
  const onJsonClose = useResultsStore(s => s.onJsonClose);
  const onEditClose = useResultsStore(s => s.onEditClose);
  const onDeleteClose = useResultsStore(s => s.onDeleteClose);

  return (
    <>
      <ResultsTable />
      <JsonModal isOpen={isJsonOpen} onClose={onJsonClose} />
      <EditModal isOpen={isEditOpen} onClose={onEditClose} />
      <DeleteModal isOpen={isDeleteOpen} onClose={onDeleteClose} />
    </>
  );
};

export default ResultsContainer;
