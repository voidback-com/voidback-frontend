import { extendTheme, useColorMode } from "@chakra-ui/react";


const config = {
  initialColorMode: "system",
  UseSystemColorMode: false,
};


export const chakraTheme = extendTheme({ config });


