import { ColumnDetails } from '../interfaces/Tables';

const getTextColor = (columnDetails: ColumnDetails, value: any, isJsonString: boolean) => {
  let textColor = '#fff';

  if (columnDetails.fkDetails) textColor = 'green.400';
  if (columnDetails.isPK) textColor = 'blue.400';
  if (value === null) textColor = 'gray.500';
  if (isJsonString) textColor = 'yellow.500';

  return textColor;
};

export default getTextColor;
