import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import Connection from '../interfaces/Connection';
import baseUrl from '../utils/baseUrl';

export interface PrimaryKeySearchDetails {
  tableName: string;
  columnName: string;
  primaryKey: number;
}

const sendData = async (dto: PrimaryKeySearchDetails, activeConnection?: Connection) => {
  const { data } = await axios.post<PrimaryKeySearchDetails>(`${baseUrl}searchByPrimaryKey`, dto, {
    headers: {
      ConnectionString: activeConnection?.connectionString,
    },
  });
  return data;
};

export const useSearchByPrimaryKey = () => {
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);

  return useMutation({
    mutationFn: (dto: PrimaryKeySearchDetails) => sendData(dto, activeConnection),
  });
};
