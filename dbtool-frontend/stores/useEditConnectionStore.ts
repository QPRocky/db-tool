import { create } from 'zustand';
import Connection from '../interfaces/Connection';

interface State {
  isConnectionModalOpen: boolean;
  editConnectionItem?: Connection;
  setEditConnectionItem: (connectionItem?: Connection) => void;
  setConnectionModalOpen: () => void;
  setConnectionModalClose: () => void;
}

const useEditConnectionStore = create<State>()(set => ({
  isConnectionModalOpen: false,
  editConnectionItem: undefined,

  setEditConnectionItem: (connectionItem?: Connection) =>
    set({
      editConnectionItem: connectionItem,
    }),

  setConnectionModalOpen: () =>
    set({
      isConnectionModalOpen: true,
    }),

  setConnectionModalClose: () =>
    set({
      isConnectionModalOpen: false,
      editConnectionItem: undefined,
    }),
}));

export default useEditConnectionStore;
