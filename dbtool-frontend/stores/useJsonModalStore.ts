import { create } from 'zustand';

interface State {
  jsonString: string;
  isModalOpen: boolean;
  setJsonString: (jsonString: string) => void;
  onModalOpen: () => void;
  onModalClose: () => void;
}

const useJsonModalStore = create<State>()(set => ({
  jsonString: '',
  isModalOpen: false,

  setJsonString: (jsonString: string) =>
    set({
      jsonString,
    }),

  onModalOpen: () =>
    set({
      isModalOpen: true,
    }),

  onModalClose: () =>
    set({
      isModalOpen: false,
    }),
}));

export default useJsonModalStore;
