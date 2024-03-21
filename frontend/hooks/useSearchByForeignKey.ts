import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import Connection from '../interfaces/Connection';
import baseUrl from '../utils/baseUrl';
import useResultsStore from '../stores/useResultsStore';
import { Tables } from '../interfaces/Tables';

export interface ForeignKeySearchDetails {
  referenceTableName: string;
  referenceColumnName: string;
  foreignKey: number;
}

const sendData = async (dto: ForeignKeySearchDetails, activeConnection?: Connection) => {
  const { data } = await axios.post<Tables>(`${baseUrl}searchByForeignKey`, dto, {
    headers: {
      ConnectionString: activeConnection?.connectionString,
    },
  });
  return data;
};

export const useSearchByForeignKey = () => {
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);
  const selectedTable = useResultsStore(s => s.selectedTable);
  const setSelectedTable = useResultsStore(s => s.setSelectedTable);
  const setResultTables = useResultsStore(s => s.setResultTables);

  return useMutation({
    mutationFn: (dto: ForeignKeySearchDetails) => sendData(dto, activeConnection),
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
