import { create } from 'zustand';
import { Tables } from '../interfaces/Tables';

interface State {
  selectedTable?: string;
  resultTables?: Tables;
  jsonString: string;
  setSelectedTable: (selectedTable: string) => void;
  setResultTables: (resultTables: Tables) => void;
  setJsonString: (jsonString: string) => void;
}

const useResultsStore = create<State>()(set => ({
  selectedTable: undefined,
  resultTables: undefined,
  jsonString: '',

  setSelectedTable: (selectedTable: string) =>
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
