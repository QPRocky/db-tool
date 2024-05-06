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
  foreignKey: any;
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
  const setSelectedTable = useResultsStore(s => s.setSelectedTable);
  const setResultTables = useResultsStore(s => s.setResultTables);

  return useMutation({
    mutationFn: (dto: ForeignKeySearchDetails) => sendData(dto, activeConnection),
    onSuccess: data => {
      if (Object.keys(data).length > 0) {
        setSelectedTable(Object.keys(data)[0]);
      } else {
        setSelectedTable(undefined);
      }

      setResultTables(data);
    },
    onError: error => {
      console.error(error);
    },
  });
};
