import { create } from 'zustand';
import { ColumnDetails } from '../interfaces/Tables';
import PrimaryKeyColumnNameAndValue from '../interfaces/PrimaryKeyColumnNameAndValue';

interface EditDetails {
  tableName: string;
  columnName: string;
  value: any;
  columnDetails: ColumnDetails;
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

interface State {
  editDetails?: EditDetails;
  isModalOpen: boolean;
  setEditDetails: (editDetails?: EditDetails) => void;
  onModalOpen: () => void;
  onModalClose: () => void;
}

const useEditColumnModalStore = create<State>()(set => ({
  editDetails: undefined,
  isModalOpen: false,

  setEditDetails: (editDetails?: EditDetails) =>
    set({
      editDetails,
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

export default useEditColumnModalStore;
