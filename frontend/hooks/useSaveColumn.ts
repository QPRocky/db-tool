import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useCurrentConnectionStore from '../stores/useCurrentConnectionStore';
import Connection from '../interfaces/Connection';
import baseUrl from '../utils/baseUrl';
import useResultsStore from '../stores/useResultsStore';
import { Tables } from '../interfaces/Tables';
import PrimaryKeyColumnNameAndValue from '../interfaces/PrimaryKeyColumnNameAndValue';

export interface SaveColumnDetails {
  tableName: string;
  columnName: string;
  value: any;
  primaryKeyColumnNamesAndValues: PrimaryKeyColumnNameAndValue[];
}

const sendData = async (dto: SaveColumnDetails, activeConnection?: Connection) => {
  const { data } = await axios.post<Tables>(`${baseUrl}saveColumn`, dto, {
    headers: {
      ConnectionString: activeConnection?.connectionString,
    },
  });
  return data;
};

export const useSaveColumn = () => {
  const activeConnection = useCurrentConnectionStore(s => s.activeConnection);
  const setResultTables = useResultsStore(s => s.setResultTables);
  const resultTables = useResultsStore(s => s.resultTables);

  return useMutation({
    mutationFn: (dto: SaveColumnDetails) => sendData(dto, activeConnection),
    onSuccess: (data, dto) => {
      const modifiedRowItem = resultTables![dto.tableName].rows.find(row => {
        return dto.primaryKeyColumnNamesAndValues.every(pk => row[pk.columnName] === pk.value);
      });

      setResultTables({
        ...resultTables!,
        [dto.tableName]: {
          ...resultTables![dto.tableName],
          rows: resultTables![dto.tableName].rows.map(row => {
            if (row === modifiedRowItem) {
              return {
                ...row,
                [dto.columnName]: dto.value,
              };
            }

            return row;
          }),
        },
      });
    },
    onError: error => {
      console.error(error);
    },
  });
};
