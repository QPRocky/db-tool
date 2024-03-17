import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(selectAnatomy.keys)

const Select = defineMultiStyleConfig({
  defaultProps: {
    size: 'sm',
    variant: 'outline',
  },
})

export default Select