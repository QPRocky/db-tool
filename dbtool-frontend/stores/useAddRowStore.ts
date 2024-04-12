import { create } from 'zustand';

interface State {
  text?: string;
  setText: (text?: string) => void;
}

const useAddRowStore = create<State>()(set => ({
  test: undefined,

  setText: (text?: string) => set({ text }),
}));

export default useAddRowStore;
