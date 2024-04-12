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
  isEditOpen: boolean;
  setEditDetails: (editDetails?: EditDetails) => void;
  onEditOpen: () => void;
  onEditClose: () => void;
}

const useEditColumnStore = create<State>()(set => ({
  editDetails: undefined,
  isEditOpen: false,

  setEditDetails: (editDetails?: EditDetails) =>
    set({
      editDetails,
    }),

  onEditOpen: () =>
    set({
      isEditOpen: true,
    }),

  onEditClose: () =>
    set({
      isEditOpen: false,
    }),
}));

export default useEditColumnStore;
