import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import Connection from '../interfaces/Connection';
import baseUrl from '../utils/baseUrl';
import getAxiosError from '../utils/getAxiosError';
import { useToast } from '@chakra-ui/react';
import { NewRowColumnDetails } from '../stores/useAddRowModalStore';
import useResultsStore from '../stores/useResultsStore';

export interface AddRowRequest {
  tableName: string;
  columns: NewRowColumnDetails[];
}

const sendData = async (dto: AddRowRequest, activeConnection?: Connection) => {
  const result = await axios.post(`${baseUrl}AddRow`, dto, {
    headers: {
      ConnectionString: activeConnection?.connectionString,
    },
  });

  return result;
};

export const useAddRow = () => {
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);
  const setResultTables = useResultsStore(s => s.setResultTables);
  const resultTables = useResultsStore(s => s.resultTables);
  const toast = useToast();

  return useMutation({
    mutationFn: (dto: AddRowRequest) => sendData(dto, activeConnection),
    onSuccess: (data, dto) => {
      const newRowFromDto = dto.columns.reduce((acc, column) => {
        acc[column.columnName] = column.columnValue;
        return acc;
      }, {} as Record<string, any>);

      setResultTables({
        ...resultTables!,
        [dto.tableName]: {
          ...resultTables![dto.tableName],
          rows: [...resultTables![dto.tableName].rows, newRowFromDto],
        },
      });
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
