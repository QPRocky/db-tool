import { create } from 'zustand';

export interface NewRowColumnDetails {
  columnName: string;
  dataType: string;
  columnValue?: any;
  isNullable: boolean;
}

interface State {
  columns?: NewRowColumnDetails[];
  isModalOpen: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
  updateColumn: (columnName: string, columnValue: any) => void;
  initColumns: (columns: NewRowColumnDetails[]) => void;
}

const useAddRowModalStore = create<State>()(set => ({
  columns: undefined,
  isModalOpen: false,

  onModalOpen: () =>
    set({
      isModalOpen: true,
    }),

  onModalClose: () =>
    set({
      isModalOpen: false,
    }),

  updateColumn: (columnName: string, columnValue: any) =>
    set(state => {
      const newColumns = state.columns!.map(column => {
        if (column.columnName === columnName) {
          return {
            ...column,
            columnValue,
          };
        }

        return column;
      });

      return {
        columns: newColumns,
      };
    }),

  initColumns: (columns: NewRowColumnDetails[]) =>
    set({
      columns,
    }),
}));

export default useAddRowModalStore;
