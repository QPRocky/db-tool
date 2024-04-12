import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Connection from '../interfaces/Connection';

interface State {
  text: string;
  setText: (text: string) => void;
}

const useNotesStore = create<State>()(
  persist(
    set => ({
      text: '',

      setText: text => {
        set({ text });
      },
    }),
    { name: 'notesStore' },
  ),
);

export default useNotesStore;
