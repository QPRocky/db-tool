import { create } from 'zustand';
import PrimaryKeyColumnNameAndValue from '../interfaces/PrimaryKeyColumnNameAndValue';

interface DeleteDetails {
  tableName: string;
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

interface State {
  deleteDetails?: DeleteDetails;
  setDeleteDetails: (deleteDetails?: DeleteDetails) => void;
}

const useDeleteRowStore = create<State>()(set => ({
  deleteDetails: undefined,

  setDeleteDetails: (deleteDetails?: DeleteDetails) =>
    set({
      deleteDetails,
    }),
}));

export default useDeleteRowStore;
