import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import Connection from '../interfaces/Connection';
import baseUrl from '../utils/baseUrl';

export interface ForeignKeySearchDetails {
  referenceTableName: string;
  referenceColumnName: string;
  foreignKey: number;
}

const sendData = async (dto: ForeignKeySearchDetails, activeConnection?: Connection) => {
  const { data } = await axios.post<ForeignKeySearchDetails>(`${baseUrl}searchByForeignKey`, dto, {
    headers: {
      ConnectionString: activeConnection?.connectionString,
    },
  });
  return data;
};

export const useSearchByForeignKey = () => {
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);

  return useMutation({
    mutationFn: (dto: ForeignKeySearchDetails) => sendData(dto, activeConnection),
  });
};
