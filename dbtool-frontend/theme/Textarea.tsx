import { defineStyleConfig } from '@chakra-ui/react'

const Textarea = defineStyleConfig({
  baseStyle: {
    fontSize: 'xs',
  },
  defaultProps: {
    size: 'sm',
    variant: 'outline',
  },
})

export default Textarea