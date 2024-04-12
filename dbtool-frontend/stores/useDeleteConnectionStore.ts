import { create } from 'zustand';
import Connection from '../interfaces/Connection';

interface State {
  isDeleteConnectionModalOpen: boolean;
  connectionItemToDelete?: Connection;
  setConnectionItemToDelete: (connectionItem?: Connection) => void;
  setDeleteConnectionModalOpen: () => void;
  setDeleteConnectionModalClose: () => void;
}

const useDeleteConnectionStore = create<State>()(set => ({
  isDeleteConnectionModalOpen: false,
  connectionItemToDelete: undefined,

  setConnectionItemToDelete: (connectionItem?: Connection) =>
    set({
      connectionItemToDelete: connectionItem,
    }),

  setDeleteConnectionModalOpen: () =>
    set({
      isDeleteConnectionModalOpen: true,
    }),

  setDeleteConnectionModalClose: () =>
    set({
      isDeleteConnectionModalOpen: false,
      connectionItemToDelete: undefined,
    }),
}));

export default useDeleteConnectionStore;
