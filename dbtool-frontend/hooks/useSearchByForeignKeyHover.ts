import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import Connection from '../interfaces/Connection';
import baseUrl from '../utils/baseUrl';
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

export const useSearchByForeignKeyHover = () => {
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);

  return useMutation({
    mutationFn: (dto: ForeignKeySearchDetails) => sendData(dto, activeConnection),
    onError: error => {
      console.error(error);
    },
  });
};
