import { Flex, Table, Text, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import TrackingResultTd from './TrackingResultTd';

interface Props {
  title: string;
  titleColor?: string;
  rows: string[];
}

type JsonRow = Record<string, any>;

const TrackingResultsTable = ({ title, titleColor, rows }: Props) => {
  const data: JsonRow[] = rows.map(row => JSON.parse(row));
  const allKeys = Array.from(new Set(data.flatMap(Object.keys)));

  const everyDataIsSame = (key: string) => data.every((val, i, arr) => val[key] === arr[0][key]);

  return (
    <Flex direction="column" mb={5}>
      <Text fontSize="sm" px={2} py={2} as="b" color={titleColor}>
        {title}
      </Text>

      <TableContainer overflowY="auto">
        <Table>
          <Thead>
            <Tr>
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
          <Tbody>
            {data.map((item, index) => (
              <Tr key={index}>
                {allKeys.map(key => (
                  <TrackingResultTd key={`${index}-${key}`} value={item[key]} />
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default TrackingResultsTable;
