import { create } from 'zustand';

interface State {
  text?: string;
  isModalOpen: boolean;
  setText: (text?: string) => void;
  onModalOpen: () => void;
  onModalClose: () => void;
}

const useAddRowModalStore = create<State>()(set => ({
  test: undefined,
  isModalOpen: false,

  setText: (text?: string) => set({ text }),

  onModalOpen: () =>
    set({
      isModalOpen: true,
    }),

  onModalClose: () =>
    set({
      isModalOpen: false,
    }),
}));

export default useAddRowModalStore;
