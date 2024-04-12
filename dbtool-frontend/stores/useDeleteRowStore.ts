import { create } from 'zustand';
import PrimaryKeyColumnNameAndValue from '../interfaces/PrimaryKeyColumnNameAndValue';

interface DeleteDetails {
  tableName: string;
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

interface State {
  deleteDetails?: DeleteDetails;
  isDeleteOpen: boolean;
  setDeleteDetails: (deleteDetails?: DeleteDetails) => void;
  onDeleteOpen: () => void;
  onDeleteClose: () => void;
}

const useDeleteRowStore = create<State>()(set => ({
  deleteDetails: undefined,
  isDeleteOpen: false,

  setDeleteDetails: (deleteDetails?: DeleteDetails) =>
    set({
      deleteDetails,
    }),

  onDeleteOpen: () =>
    set({
      isDeleteOpen: true,
    }),

  onDeleteClose: () =>
    set({
      isDeleteOpen: false,
    }),
}));

export default useDeleteRowStore;
