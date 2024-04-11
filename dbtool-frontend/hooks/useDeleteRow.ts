import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import Connection from '../interfaces/Connection';
import baseUrl from '../utils/baseUrl';
import useResultsStore from '../stores/useResultsStore';
import PrimaryKeyColumnNameAndValue from '../interfaces/PrimaryKeyColumnNameAndValue';
import getAxiosError from '../utils/getAxiosError';
import { useToast } from '@chakra-ui/react';

export interface RemoveRowDetails {
  tableName: string;
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

const sendData = async (dto: RemoveRowDetails, activeConnection?: Connection) => {
  const response = await axios.delete(`${baseUrl}DeleteRow`, {
    data: dto,
    headers: {
      ConnectionString: activeConnection?.connectionString,
    },
  });

  return response;
};

export const useDeleteRow = () => {
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);
  const setResultTables = useResultsStore(s => s.setResultTables);
  const resultTables = useResultsStore(s => s.resultTables);
  const toast = useToast();

  return useMutation({
    mutationFn: (dto: RemoveRowDetails) => sendData(dto, activeConnection),
    onSuccess: (data, dto) => {
      const rowToRemove = resultTables![dto.tableName].rows.find(row => {
        return dto.primaryKeyColumnNamesAndValues.every(pk => row[pk.columnName] === pk.value);
      });

      if (rowToRemove) {
        setResultTables({
          ...resultTables!,
          [dto.tableName]: {
            ...resultTables![dto.tableName],
            rows: resultTables![dto.tableName].rows.filter(row => row !== rowToRemove),
          },
        });
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
