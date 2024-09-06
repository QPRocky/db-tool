import { Tbody, Tr } from '@chakra-ui/react';
import TrackingResultTd from './TrackingResultTd';
import IndexTd from './IndexTd';

interface Props {
  rows: string[];
}

type JsonRow = Record<string, any>;

const TrackingResultsTableBody = ({ rows }: Props) => {
  const data: JsonRow[] = rows.map(row => JSON.parse(row));
  const allKeys = Array.from(new Set(data.flatMap(Object.keys)));

  return (
    <Tbody>
      {data.map((item, index) => (
        <Tr key={index}>
          <IndexTd index={index + 1} />
          {allKeys.map(key => (
            <TrackingResultTd key={`${index}-${key}`} value={item[key]} />
          ))}
        </Tr>
      ))}
    </Tbody>
  );
};

export default TrackingResultsTableBody;
