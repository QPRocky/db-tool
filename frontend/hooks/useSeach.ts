import { useQuery } from '@tanstack/react-query';
import { Tables } from '../interfaces/Tables';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import Connection from '../interfaces/Connection';
import baseUrl from '../utils/baseUrl';

const getData = async (searchValue: string, activeConnection?: Connection) => {
  const { data } = await axios.get<Tables>(`${baseUrl}search?searchQuery=${searchValue}`, {
    headers: {
      ConnectionString: activeConnection?.connectionString,
    },
  });

  return data;
};

export const useSeach = (searchValue: string) => {
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);

  return useQuery({
    queryKey: ['seach', searchValue],
    queryFn: () => getData(searchValue, activeConnection),
    enabled: false,
  });
};
