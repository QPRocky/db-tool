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
  setEditDetails: (editDetails?: EditDetails) => void;
}

const useEditColumn = create<State>()(set => ({
  editDetails: undefined,

  setEditDetails: (editDetails?: EditDetails) =>
    set({
      editDetails,
    }),
}));

export default useEditColumn;
