'use client'
import { 
  VStack,
  Container,
  Show,
} from "@chakra-ui/react";
import { HashtagSentimentQueryCard, KeywordSentimentQueryCard, SymbolSentimentQueryCard } from "./components/Cards";
import { NavBarTop } from "./components/NavBar";




const Page = () => {

  return (
    <Container 
      minW={"100%"} 
      overflow={"hidden"} 
      height="100vh" 
      padding={0}
      className="bg-background flex flex-col"
    >
      <NavBarTop />
      <div
        className="w-full h-full flex flex-row bg-red-200"
      >
        <SymbolSentimentQueryCard />
        <HashtagSentimentQueryCard />

        <Show breakpoint="(min-width: 1000px)">
          <KeywordSentimentQueryCard />
        </Show>
      </div>
    </Container>
  )
}



export default Page;
