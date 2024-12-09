'use client'
import { useState, useEffect } from "react";
import { 
  VStack,
  Container,
  Show,
} from "@chakra-ui/react";
import { FeedBackPollCard, HashtagSentimentQueryCard, KeywordSentimentQueryCard, PositionPollCard, SymbolSentimentQueryCard } from "./components/Cards";
import { NavBarTop } from "./components/NavBar";
import { useDisclosure } from "@nextui-org/react";
import { Drawers } from "./components/drawers";



const Page = () => {

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
