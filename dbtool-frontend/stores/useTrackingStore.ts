import { create } from 'zustand';
import { ChangeResults } from '../interfaces/ChangeResults';

export type TrackingState = 'start' | 'stop';

interface State {
  state: TrackingState;
  changeResults?: ChangeResults;
  selectedTrackingTable?: string;
  toggleState: () => void;
  setChangeResults: (changeResults?: ChangeResults) => void;
  setSelectedTrackingTable: (selectedTrackingTable?: string) => void;
}

const useTrackingStore = create<State>()(set => ({
  state: 'start',
  changeResults: undefined,
  selectedTrackingTable: undefined,

  toggleState: () =>
    set(state => ({
      state: state.state === 'start' ? 'stop' : 'start',
    })),

  setChangeResults: (changeResults?: ChangeResults) =>
    set({
      changeResults,
    }),

  setSelectedTrackingTable: (selectedTrackingTable?: string) =>
    set({
      selectedTrackingTable,
    }),
}));

export default useTrackingStore;
