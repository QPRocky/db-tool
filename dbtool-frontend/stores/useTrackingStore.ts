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
  /*changeResults: {
    inserted: {
      'Kohde.Kohde1': { rows: ['row1', 'row2'] },
      'Kohde.Kohde2': { rows: ['row3'] },
    },
    updated: {
      'Kohde.Kohde1': { rows: ['row4', 'row5'] },
      'Kohde.Kohde2': { rows: ['row6'] },
    },
    deleted: {
      'Kohde.Kohde1': { rows: ['row7'] },
      'Kohde.Kohde3': { rows: ['row8', 'row9'] },
    },
  },*/
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
