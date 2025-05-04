'use client'
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from '@chakra-ui/color-mode';
import AuthContextProvider from "./AuthProvider/index.js";
import { chakraTheme } from "../configs/Theme.js";
import LeftFeedContextProvider from "./FeedsProvider/LeftFeedProvider.js";
import SidebarContextProvider from "./FeedsProvider/SidebarProvider.js";
import {NextUIProvider} from "@nextui-org/react";
import EditorContextProvider from "./FeedsProvider/EditorProvider.js";
 

        


export default function Providers ({children}) {

  return (
    <ChakraProvider theme={chakraTheme}>
      <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode}/>
        <NextUIProvider>
          <AuthContextProvider>
              <SidebarContextProvider>
                <LeftFeedContextProvider>
                  <EditorContextProvider>
                    {children}
                  </EditorContextProvider>
                </LeftFeedContextProvider>
              </SidebarContextProvider>
          </AuthContextProvider>
        </NextUIProvider>
    </ChakraProvider>
  )

}
