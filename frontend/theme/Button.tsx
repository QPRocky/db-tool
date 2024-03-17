import { defineStyleConfig } from '@chakra-ui/react'

const Button = defineStyleConfig({
  sizes: {
    sm: {
      fontSize: 'xs'
    },
  },
  variants: {
    solid: {
      bg: "gray.700"
    }
  },
  defaultProps: {
    size: 'sm',
    variant: 'solid',
  },
})

export default Button