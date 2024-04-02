import { create } from 'zustand';
import { ColumnDetails } from '../interfaces/Tables';

interface EditDetails {
  tableName: string;
  columnName: string;
  primaryKeyName: string;
  value: any;
  columnDetails: ColumnDetails;
}

//        var sql = "UPDATE tableName SET columnName = @Yritys WHERE Kohde_ID = @Kohde_ID";

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
