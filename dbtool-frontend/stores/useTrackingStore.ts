import { create } from 'zustand';

export type TrackingState = 'start' | 'stop';

interface State {
  state: TrackingState;
  toggleState: () => void;
}

const useTrackingStore = create<State>()(set => ({
  state: 'start',

  toggleState: () =>
    set(state => ({
      state: state.state === 'start' ? 'stop' : 'start',
    })),
}));

export default useTrackingStore;
