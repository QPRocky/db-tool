import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import Connection from '../interfaces/Connection';
import baseUrl from '../utils/baseUrl';
import useResultsStore from '../stores/useResultsStore';
import { Tables } from '../interfaces/Tables';

export interface SaveColumnDetails {
  tableName: string;
  columnName: string;
  value: any;
  dataType: string;
}

const sendData = async (dto: SaveColumnDetails, activeConnection?: Connection) => {
  const { data } = await axios.post<Tables>(`${baseUrl}saveColumn`, dto, {
    headers: {
      ConnectionString: activeConnection?.connectionString,
    },
  });
  return data;
};

export const useSaveColumn = () => {
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);
  const selectedTable = useResultsStore(s => s.selectedTable);
  const setSelectedTable = useResultsStore(s => s.setSelectedTable);
  const setResultTables = useResultsStore(s => s.setResultTables);

  return useMutation({
    mutationFn: (dto: SaveColumnDetails) => sendData(dto, activeConnection),
    onSuccess: data => {
      const resetSelectedTable = !selectedTable || !data || !data[selectedTable];

      if (resetSelectedTable) {
        setSelectedTable(undefined);
      }

      setResultTables(data);
    },
    onError: error => {
      console.error(error);
    },
  });
};
