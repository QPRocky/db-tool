import { Th, Thead, Tr } from '@chakra-ui/react';

interface Props {
  rows: string[];
}

type JsonRow = Record<string, any>;

const TrackingResultsTableHead = ({ rows }: Props) => {
  const data: JsonRow[] = rows.map(row => JSON.parse(row));
  const allKeys = Array.from(new Set(data.flatMap(Object.keys)));

  const everyDataIsSame = (key: string) => data.every((val, i, arr) => val[key] === arr[0][key]);

  return (
    <Thead>
      <Tr>
        <Th position="sticky" left={0} zIndex={1} />
        {allKeys.map(key => {
          const color = everyDataIsSame(key) ? 'white' : 'blue.400';
          return (
            <Th key={key} color={color}>
              {key}
            </Th>
          );
        })}
      </Tr>
    </Thead>
  );
};

export default TrackingResultsTableHead;
