import { create } from 'zustand';
import { Tables } from '../interfaces/Tables';

interface State {
  selectedTable?: string;
  resultTables?: Tables;
  setSelectedTable: (selectedTable?: string) => void;
  setResultTables: (resultTables: Tables) => void;
}

const useResultsStore = create<State>()(set => ({
  selectedTable: undefined,
  resultTables: undefined,

  setSelectedTable: (selectedTable?: string) =>
    set({
      selectedTable,
    }),

  setResultTables: (resultTables: Tables) =>
    set({
      resultTables,
    }),
}));

export default useResultsStore;
