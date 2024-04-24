import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import Connection from '../interfaces/Connection';
import baseUrl from '../utils/baseUrl';
import getAxiosError from '../utils/getAxiosError';
import { useToast } from '@chakra-ui/react';
import useTrackingStore, { TrackingState } from '../stores/useTrackingStore';
import { ChangeResults } from '../interfaces/ChangeResults';

const sendData = async (state: TrackingState, activeConnection?: Connection) => {
  const { data } = await axios.put<ChangeResults>(`${baseUrl}tracking?state=${state}`, null, {
    headers: {
      ConnectionString: activeConnection?.connectionString,
    },
  });

  return data;
};

export const useTracking = () => {
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);
  const setChangeResults = useTrackingStore(s => s.setChangeResults);
  const toast = useToast();

  return useMutation({
    mutationFn: (state: TrackingState) => sendData(state, activeConnection),
    onSuccess: (data, variables) => {
      if ((variables as TrackingState) === 'stop') {
        setChangeResults(data);
      }
    },
    onError: error => {
      const errorMessage = getAxiosError(error);

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    },
  });
};
