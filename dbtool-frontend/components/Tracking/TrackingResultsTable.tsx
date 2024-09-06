import { Flex, Table, Text, TableContainer } from '@chakra-ui/react';
import TrackingResultsTableHead from './TrackingResultsTableHead';
import TrackingResultsTableBody from './TrackingResultsTableBody';

interface Props {
  title: string;
  titleColor?: string;
  rows: string[];
}

const TrackingResultsTable = ({ title, titleColor, rows }: Props) => {
  return (
    <Flex direction="column" mb={5}>
      <Text fontSize="sm" px={2} py={2} as="b" color={titleColor}>
        {title}
      </Text>

      <TableContainer overflowY="auto">
        <Table>
          <TrackingResultsTableHead rows={rows} />
          <TrackingResultsTableBody rows={rows} />
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default TrackingResultsTable;
