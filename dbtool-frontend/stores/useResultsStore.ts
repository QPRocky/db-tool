import { create } from 'zustand';
import { Tables } from '../interfaces/Tables';

export const ROWS_PER_PAGE = 100;

interface State {
  selectedTable?: string;
  resultTables?: Tables;
  currentPage: number;
  currentRows: Record<string, any>[];
  setSelectedTable: (selectedTable?: string) => void;
  setResultTables: (resultTables: Tables) => void;
  setCurrentPage: (currentPage: number) => void;
  setCurrentRows: (currentRows: Record<string, any>[]) => void;
}

const useResultsStore = create<State>()(set => ({
  selectedTable: undefined,
  resultTables: undefined,
  currentPage: 1,
  currentRows: [],

  setSelectedTable: (selectedTable?: string) =>
    set({
      selectedTable,
      currentPage: 1,
    }),

  setResultTables: (resultTables: Tables) =>
    set({
      resultTables,
      currentPage: 1,
    }),

  setCurrentPage: (currentPage: number) =>
    set({
      currentPage,
    }),

  setCurrentRows: (currentRows: Record<string, any>[]) =>
    set({
      currentRows,
    }),
}));

export default useResultsStore;
