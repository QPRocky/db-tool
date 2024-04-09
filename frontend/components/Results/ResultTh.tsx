import { Th, Flex, Text } from '@chakra-ui/react';
import { ColumnDetails } from '../../interfaces/Tables';
import FKTextWithTooltip from './FKTextWithTooltip';
import PKText from './PKText';
import DatatypeText from './DatatypeText';
import ColumnNameText from './ColumnNameText';

interface Props {
  columnName: string;
  columnDetails: ColumnDetails;
}

const ResultTh = ({ columnName, columnDetails }: Props) => {
  return (
    <Th>
      <Flex direction="column">
        <ColumnNameText columnName={columnName} />
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
    </Th>
  );
};

export default ResultTh;
