import { Th, Flex } from '@chakra-ui/react';
import { ColumnDetails } from '../../interfaces/Tables';
import FKTextWithTooltip from './FKTextWithTooltip';
import PKText from './PKText';
import DatatypeText from './DatatypeText';
import ColumnNameText from './ColumnNameText';
import RequiredText from './RequiredText';

interface Props {
  columnName: string;
  columnDetails: ColumnDetails;
}

const ResultTh = ({ columnName, columnDetails }: Props) => {
  return (
    <Th>
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
    </Th>
  );
};

export default ResultTh;
