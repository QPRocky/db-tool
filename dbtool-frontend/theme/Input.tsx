import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys)

const Input = defineMultiStyleConfig({
  variants: {
    outline: {
      field: {
        bg: "gray.700",
      }
    },
  },
  defaultProps: {
    size: 'sm',
    variant: 'outline',
  },
})

export default Input