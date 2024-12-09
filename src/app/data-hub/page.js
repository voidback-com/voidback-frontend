'use client'
import { useState, useEffect } from "react";
import { 
  VStack,
  Container,
  Show,
  useToast,
} from "@chakra-ui/react";
import { FeedBackPollCard, HashtagSentimentQueryCard, KeywordSentimentQueryCard, PositionPollCard, SymbolSentimentQueryCard } from "./components/Cards";
import { NavBarTop } from "./components/NavBar";
import { useDisclosure } from "@nextui-org/react";
import { Drawers } from "./components/drawers";
import { isAuthenticated } from "../configs/api";
import { useRouter } from "next/navigation";



export const metdata = {
  title: "Data-Hub",
  description: "Voidback's Data-Hub page.",
  referrer: "origin-when-cross-origin",
  keywords: ["finance", "quant", "voidback", "social media", "platform", "voidback login", "fintech", "data-hub", "data broker", "financial data", "realtime data", "stocks", "options", "stock market", "investments", "models", "quantitative analysis"]
}



const Page = () => {


  const router = useRouter();

  const toast = useToast();

  useEffect(()=> {
    if(!isAuthenticated())
    {
      if(!toast.isActive(2))
        toast({
          title: "You have to login to use the data-hub.",
          status: "info",
          duration: 5000,
          isClosable: true,
          id: 2
        })
      return router.replace("/home/foryou");
    }
  }, [])



  const [refresh, setRefresh] = useState(false);
  const [myQueries, setMyQueries] = useState(false);
  const [ticker, setTicker] = useState(null);

  useEffect(()=> {
    if(refresh)
      setRefresh(false);
  }, [refresh])


  const myQueriesDrawer = useDisclosure();

  return (
    <Container 
      minW={"100%"} 
      overflow={"hidden"} 
      height="100vh" 
      padding={0}
      className="bg-background flex flex-col"
    >
      <NavBarTop 
        refresh={refresh} 
        myQueriesDrawer={myQueriesDrawer}
        setMyQueries={setMyQueries}
      />
      <div
        className="w-full h-full flex flex-row"
      >
        <SymbolSentimentQueryCard setRefresh={setRefresh} setTicker={setTicker} />

        <Show breakpoint="(min-width: 1000px)">
          <PositionPollCard ticker={ticker} />

          <FeedBackPollCard ticker={ticker} />
        </Show>
      </div>


      <Drawers 
        myQueriesDrawer={myQueriesDrawer}
        myQueriesData={myQueries}
      />

    </Container>
  )
}



export default Page;
