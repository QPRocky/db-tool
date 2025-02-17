import { format } from 'date-fns';
import { ColumnDetails } from '../interfaces/Tables';

const formatValue = (columnDetails: ColumnDetails, value: any) => {
  if (columnDetails.dataType === 'datetime' || columnDetails.dataType === 'datetime2') {
    if (value) {
      value = format(value, 'dd.MM.yyyy HH:mm');
    }
  }

  if (columnDetails.dataType === 'bit') {
    value = value ? '[x]' : '[ ]';
  }

  if (typeof value === 'boolean') {
    if (value === true) {
      value = '[x]';
    } else {
      value = '[ ]';
    }
  }

  if (value && value.length > 150) {
    value = value.substring(0, 150);
  }

  if (value === null) {
    value = 'null';
  }

  return value;
};

export default formatValue;
