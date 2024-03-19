import { ResponsiveValue } from '@chakra-ui/react';
import { ColumnDetails } from '../interfaces/Tables';

const getCursor = (columnDetails: ColumnDetails, isJsonString: boolean, value: any) => {
  let cursor: ResponsiveValue<any> = undefined;

  if (isJsonString) cursor = 'pointer';
  if (columnDetails.isPK) cursor = 'pointer';
  if (columnDetails.fkDetails) cursor = 'pointer';
  if (value === null) cursor = undefined;

  return cursor;
};

export default getCursor;
