import { defineStyleConfig } from '@chakra-ui/react';

const Table = defineStyleConfig({
  variants: {
    solid: {
      th: {
        bg: 'gray.600',
        border: '1px solid',
        borderColor: 'gray.700',
        textTransform: 'none',
        fontSize: '12px',
        p: 1,
      },
      tr: {
        _hover: {
          bg: 'gray.600',
        },
      },
      td: {
        border: '1px solid',
        borderColor: 'gray.500',
        fontSize: '12px',
        p: 1,
      },
    },
  },
  defaultProps: {
    size: 'sm',
    variant: 'solid',
  },
});

export default Table;
