import { create } from 'zustand';
import Connection from '../interfaces/Connection';

type ConnectionStatus = 'connected' | 'disconnected';

interface State {
  connectionStatus: ConnectionStatus;
  activeConnection?: Connection;
  setAsConnected: (connection: Connection) => void;
  setAsDisconnected: () => void;
}

const useCurrentConnectionStore = create<State>()(set => ({
  connectionStatus: 'disconnected',
  activeConnection: undefined,

  setAsConnected: (connection: Connection) =>
    set({
      connectionStatus: 'connected',
      activeConnection: connection,
    }),

  setAsDisconnected: () =>
    set({
      connectionStatus: 'disconnected',
      activeConnection: undefined,
    }),
}));

export default useCurrentConnectionStore;
