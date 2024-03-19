import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';

const getData = async (connectionString: string) => {
  const res = await axios.get(`${baseUrl}testConnection`, {
    headers: {
      ConnectionString: connectionString,
    },
  });

  return res;
};

export const useTestConnection = (connectionString: string) => {
  return useQuery({
    queryKey: ['testConnection', connectionString],
    queryFn: () => getData(connectionString),
    enabled: false,
  });
};
