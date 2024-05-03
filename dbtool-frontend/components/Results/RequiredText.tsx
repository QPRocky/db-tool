import { Text } from '@chakra-ui/react';
import { ColumnDetails } from '../../interfaces/Tables';

interface Props {
  columnDetails: ColumnDetails;
}

const RequiredText = ({ columnDetails }: Props) => {
  return (
    <>
      {!columnDetails.isNullable && (
        <Text ml={1} fontSize="sm" color="red.500">
          *
        </Text>
      )}
    </>
  );
};

export default RequiredText;
