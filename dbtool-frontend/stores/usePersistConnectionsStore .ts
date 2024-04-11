import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Connection from '../interfaces/Connection';

interface State {
  connections: Connection[];
  saveConnection: (connection: Connection) => void;
  deleteConnection: (connection: Connection) => void;
}

const usePersistConnectionsStore = create<State>()(
  persist(
    set => ({
      connections: [],

      saveConnection: connection => {
        set(state => ({
          connections: state.connections.some(c => c.uid === connection.uid)
            ? state.connections.map(c => (c.uid === connection.uid ? connection : c))
            : [...state.connections, connection],
        }));
      },

      deleteConnection: connection => {
        set(state => ({
          connections: state.connections.filter(c => c !== connection),
        }));
      },
    }),
    { name: 'dbConnectionsStore' },
  ),
);

export default usePersistConnectionsStore;
