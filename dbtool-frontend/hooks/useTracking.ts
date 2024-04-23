import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import Connection from '../interfaces/Connection';
import baseUrl from '../utils/baseUrl';
import getAxiosError from '../utils/getAxiosError';
import { useToast } from '@chakra-ui/react';
import useResultsStore from '../stores/useResultsStore';
import { TrackingState } from '../stores/useTrackingStore';

const sendData = async (state: TrackingState, activeConnection?: Connection) => {
  const result = await axios.put(`${baseUrl}tracking?state=${state}`, null, {
    headers: {
      ConnectionString: activeConnection?.connectionString,
    },
  });

  return result;
};

export const useTracking = () => {
  const queryClient = useQueryClient();
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);
  const setResultTables = useResultsStore(s => s.setResultTables);
  const resultTables = useResultsStore(s => s.resultTables);
  const toast = useToast();

  return useMutation({
    mutationFn: (state: TrackingState) => sendData(state, activeConnection),
    onSuccess: (data, dto) => {},
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
