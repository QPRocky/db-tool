import { create } from 'zustand';

interface State {
  jsonString: string;
  isJsonOpen: boolean;
  setJsonString: (jsonString: string) => void;
  onJsonOpen: () => void;
  onJsonClose: () => void;
}

const useJsonStore = create<State>()(set => ({
  jsonString: '',
  isJsonOpen: false,

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
}));

export default useJsonStore;
