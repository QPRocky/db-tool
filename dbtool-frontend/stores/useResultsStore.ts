import { create } from 'zustand';
import { Tables } from '../interfaces/Tables';

interface State {
  selectedTable?: string;
  resultTables?: Tables;
  jsonString: string;
  isJsonOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  isAddRowOpen: boolean;
  setSelectedTable: (selectedTable?: string) => void;
  setResultTables: (resultTables: Tables) => void;
  setJsonString: (jsonString: string) => void;
  onJsonOpen: () => void;
  onJsonClose: () => void;
  onEditOpen: () => void;
  onEditClose: () => void;
  onDeleteOpen: () => void;
  onDeleteClose: () => void;
  onAddRowOpen: () => void;
  onAddRowClose: () => void;
}

const useResultsStore = create<State>()(set => ({
  selectedTable: undefined,
  resultTables: undefined,
  jsonString: '',
  isJsonOpen: false,
  isEditOpen: false,
  isDeleteOpen: false,
  isAddRowOpen: false,

  setSelectedTable: (selectedTable?: string) =>
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

  onJsonOpen: () =>
    set({
      isJsonOpen: true,
    }),

  onJsonClose: () =>
    set({
      isJsonOpen: false,
    }),

  onEditOpen: () =>
    set({
      isEditOpen: true,
    }),

  onEditClose: () =>
    set({
      isEditOpen: false,
    }),

  onDeleteOpen: () =>
    set({
      isDeleteOpen: true,
    }),

  onDeleteClose: () =>
    set({
      isDeleteOpen: false,
    }),

  onAddRowOpen: () =>
    set({
      isAddRowOpen: true,
    }),

  onAddRowClose: () =>
    set({
      isAddRowOpen: false,
    }),
}));

export default useResultsStore;
