import { Text, Tooltip } from '@chakra-ui/react';

interface Props {
  label: string;
}

const FKTextWithTooltip = ({ label }: Props) => {
  return (
    <Tooltip bg="gray.600" color="green.400" fontSize="xs" fontWeight={900} label={label} aria-label="A tooltip">
      <Text fontSize="xs" color="green.500" ml={1}>
        FK
      </Text>
    </Tooltip>
  );
};

export default FKTextWithTooltip;
