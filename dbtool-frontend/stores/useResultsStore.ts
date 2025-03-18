import { create } from 'zustand';
import { Tables } from '../interfaces/Tables';

export const ROWS_PER_PAGE = 100;

interface State {
  selectedTable?: string;
  resultTables?: Tables;
  currentPage: number;
  currentRows: Record<string, any>[];
  sortingColumnName?: string;
  isSortingAsc: boolean;
  setSelectedTable: (selectedTable?: string) => void;
  setResultTables: (resultTables: Tables) => void;
  setCurrentPage: (currentPage: number) => void;
  setCurrentRows: (currentRows: Record<string, any>[]) => void;
  setSortingColumnName: (sortingColumnName?: string) => void;
}

const useResultsStore = create<State>()(set => ({
  selectedTable: undefined,
  resultTables: undefined,
  currentPage: 1,
  currentRows: [],
  sortingColumnName: undefined,
  isSortingAsc: true,

  setSelectedTable: (selectedTable?: string) =>
    set(state => {
      const sortingColumnName =
        selectedTable && state.resultTables ? Object.keys(state.resultTables[selectedTable].columns)[0] : undefined;

      return {
        selectedTable,
        currentPage: 1,
        sortingColumnName,
        isSortingAsc: sortingColumnName ? true : false,
      };
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

  setSortingColumnName: (sortingColumnName?: string) =>
    set(state => {
      return {
        isSortingAsc: state.sortingColumnName === sortingColumnName ? !state.isSortingAsc : true,
        sortingColumnName,
      };
    }),
}));

export default useResultsStore;
