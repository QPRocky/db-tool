import { Th, Flex } from '@chakra-ui/react';
import { ColumnDetails } from '../../interfaces/Tables';
import FKTextWithTooltip from './FKTextWithTooltip';
import PKText from './PKText';
import DatatypeText from './DatatypeText';
import ColumnNameText from './ColumnNameText';
import RequiredText from './RequiredText';
import { VscArrowDown, VscArrowUp } from 'react-icons/vsc';
import useResultsStore from '../../stores/useResultsStore';

interface Props {
  columnName: string;
  columnDetails: ColumnDetails;
}

const ResultTh = ({ columnName, columnDetails }: Props) => {
  const sortingColumnName = useResultsStore(s => s.sortingColumnName);
  const setSortingColumnName = useResultsStore(s => s.setSortingColumnName);
  const isSortingAsc = useResultsStore(s => s.isSortingAsc);

  return (
    <Th>
      <Flex direction="row" justify="space-between">
        <Flex direction="column">
          <Flex>
            <ColumnNameText columnName={columnName} />
            <RequiredText columnDetails={columnDetails} />
          </Flex>
          <Flex>
            <DatatypeText dataType={columnDetails.dataType} />
            {columnDetails.isPK && <PKText />}
            {columnDetails.fkDetails && (
              <FKTextWithTooltip
                label={columnDetails.fkDetails.referenceTableName + ' ' + columnDetails.fkDetails.referenceColumnName}
              />
            )}
          </Flex>
        </Flex>

        <Flex align="flex-end">
          <Flex
            onClick={() => setSortingColumnName(columnName)}
            cursor="pointer"
            borderRadius={5}
            p={1}
            bg={sortingColumnName === columnName ? 'gray.500' : 'transparent'}
          >
            {sortingColumnName !== columnName && <VscArrowDown color="#fff" />}
            {sortingColumnName === columnName && isSortingAsc && <VscArrowDown color="#fff" />}
            {sortingColumnName === columnName && !isSortingAsc && <VscArrowUp color="#fff" />}
          </Flex>
        </Flex>
      </Flex>
    </Th>
  );
};

export default ResultTh;
