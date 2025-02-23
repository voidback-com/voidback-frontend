'use client'
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from '@chakra-ui/color-mode';
import AuthContextProvider from "./AuthProvider/index.js";
import RightFeedContextProvider from "./FeedsProvider/RightFeedProvider.js";
import EditorContextProvider from "./FeedsProvider/PostEditorProvider.js";
import { chakraTheme } from "../configs/Theme.js";
import LeftFeedContextProvider from "./FeedsProvider/LeftFeedProvider.js";
import SidebarContextProvider from "./FeedsProvider/SidebarProvider.js";
import {NextUIProvider} from "@nextui-org/react";
import AnalyticsContextProvider from "./AnalyticsProvider/index.js";
import DataHubContextProvider from "./DataHubProvider/index.js";
import DirectMessageContextProvider from "./DirectMessageProvider/index.js";
 

        


export default function Providers ({children}) {

  return (
    <ChakraProvider theme={chakraTheme}>
      <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode}/>
        <NextUIProvider>
          <AnalyticsContextProvider>
            <AuthContextProvider>
              <RightFeedContextProvider>
                <SidebarContextProvider>
                  <LeftFeedContextProvider>
                    <EditorContextProvider>
                      <DataHubContextProvider>
                        <DirectMessageContextProvider>
                          {children}
                        </DirectMessageContextProvider>
                      </DataHubContextProvider>
                    </EditorContextProvider>
                  </LeftFeedContextProvider>
                </SidebarContextProvider>
              </RightFeedContextProvider>
            </AuthContextProvider>
          </AnalyticsContextProvider>
        </NextUIProvider>
    </ChakraProvider>
  )

}
