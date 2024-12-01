import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from '@chakra-ui/color-mode';
import AuthContextProvider from "./AuthProvider/index.js";
import RightFeedContextProvider from "./FeedsProvider/RightFeedProvider.js";
import EditorContextProvider from "./FeedsProvider/PostEditorProvider.js";
import { chakraTheme } from "../configs/Theme.js";
import LeftFeedContextProvider from "./FeedsProvider/LeftFeedProvider.js";
import SidebarContextProvider from "./FeedsProvider/SidebarProvider.js";
import {NextUIProvider} from "@nextui-org/react";
import GreedyFetchContextProvider from "./greedyFetch/index.js";
import AnalyticsContextProvider from "./AnalyticsProvider/index.js";
import dynamic from 'next/dynamic'
 

        


export default function Providers ({children}) {


  return (
    <ChakraProvider theme={chakraTheme}>
      <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode}/>
        <NextUIProvider>
          <GreedyFetchContextProvider>
            <AuthContextProvider>
              <AnalyticsContextProvider>
                <RightFeedContextProvider>
                  <SidebarContextProvider>
                    <LeftFeedContextProvider>
                      <EditorContextProvider>
                        {children}
                      </EditorContextProvider>
                    </LeftFeedContextProvider>
                  </SidebarContextProvider>
                </RightFeedContextProvider>
              </AnalyticsContextProvider>
            </AuthContextProvider>
          </GreedyFetchContextProvider>
        </NextUIProvider>
    </ChakraProvider>
  )

}
