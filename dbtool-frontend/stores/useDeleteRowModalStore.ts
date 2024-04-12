import { create } from 'zustand';
import PrimaryKeyColumnNameAndValue from '../interfaces/PrimaryKeyColumnNameAndValue';

interface DeleteDetails {
  tableName: string;
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

interface State {
  deleteDetails?: DeleteDetails;
  isModalOpen: boolean;
  setDeleteDetails: (deleteDetails?: DeleteDetails) => void;
  onModalOpen: () => void;
  onModalClose: () => void;
}

const useDeleteRowModalStore = create<State>()(set => ({
  deleteDetails: undefined,
  isModalOpen: false,

  setDeleteDetails: (deleteDetails?: DeleteDetails) =>
    set({
      deleteDetails,
    }),

  onModalOpen: () =>
    set({
      isModalOpen: true,
    }),

  onModalClose: () =>
    set({
      isModalOpen: false,
    }),
}));

export default useDeleteRowModalStore;
