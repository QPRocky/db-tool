import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import Button from "./Button";
import Input from "./Input";
import Table from "./Table";
import Select from "./Select";
import Textarea from "./Textarea";
import fonts from "./fonts";

const config: ThemeConfig = {
  initialColorMode: 'dark',
}

const theme = extendTheme({
  config,
  fonts,
  components: {
    Button,
    Input,
    Table,
    Select,
    Textarea
  }
})

export default theme
