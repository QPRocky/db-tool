import { create } from 'zustand';
import { TableDetails, Tables } from '../interfaces/Tables';

interface State {
  selectedTable?: TableDetails;
  resultTables?: Tables;
  jsonString: string;
  setSelectedTable: (selectedTable: TableDetails) => void;
  setResultTables: (resultTables: Tables) => void;
  setJsonString: (jsonString: string) => void;
}

const useResultsStore = create<State>()(set => ({
  selectedTable: undefined,
  resultTables: undefined,
  jsonString: '',

  setSelectedTable: (selectedTable: TableDetails) =>
    set({
      selectedTable,
    }),

  setResultTables: (resultTables: Tables) =>
    set({
      resultTables,
    }),

  setJsonString: (jsonString: string) =>
    set({
      jsonString,
    }),
}));

export default useResultsStore;
