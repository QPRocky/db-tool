import { Flex, Table, Text, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

interface Props {
  title: string;
  titleColor?: string;
  rows: string[];
}

type JsonRow = Record<string, any>;

const TrackingResultsTable = ({ title, titleColor, rows }: Props) => {
  const data: JsonRow[] = rows.map(row => JSON.parse(row));
  const allKeys = Array.from(new Set(data.flatMap(Object.keys)));

  return (
    <Flex direction="column" mb={5}>
      <Text fontSize="sm" px={2} py={2} as="b" color={titleColor}>
        {title}
      </Text>

      <TableContainer overflowY="auto">
        <Table>
          <Thead>
            <Tr>
              {allKeys.map(key => (
                <Th key={key}>{key}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, index) => (
              <Tr key={index}>
                {allKeys.map(key => (
                  <Td key={`${index}-${key}`} color={item[key] === null ? 'gray.500' : '#fff'}>
                    {item[key] === null ? 'null' : item[key]}
                  </Td>
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
