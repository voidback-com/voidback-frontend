'use client'
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { 
  VStack,
  Wrap,
  WrapItem,
  Spacer,
  useToast,
  HStack,
  Text
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { TopSection } from "./components/topSection";
import { SidebarContext } from "../providers/FeedsProvider/SidebarProvider";
import { ResearchPaperCard } from "./components/components";
import InfiniteScroll from "react-infinite-scroller";
import { Pagination, Spinner } from "@nextui-org/react";
import { errorToReadable } from "../configs/api";
import { LeftSection } from "../home/components/Sections";


export const metdata = {
  title: "Research",
  description: "Voidback's research page.",
  referrer: "origin-when-cross-origin",
  keywords: ["finance", "quant", "voidback", "social media", "platform", "voidback login", "fintech", "data-hub", "data broker", "financial data", "realtime data", "stocks", "options", "stock market", "investments", "models", "quantitative analysis"]
}





export const renderPapers = (papers) => {

  const renderItems = () => {
    if(papers && papers.length)
      return papers.map((paper)=> {
        return <WrapItem key={paper.id}><ResearchPaperCard paper={paper} /></WrapItem>
      })
  }

  return renderItems()
}





const ResearchPage = () => {

  const { searchPapers, loadTopPapers } = useContext(SidebarContext);

  const [pageLoading, setPageLoading] = useState(false);
  const [papers, setPapers] = useState([]);
  const [pagesCount, setPagesCount] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');



  const toast = useToast();


  const fetchPapers = async (page) => {

    setPageLoading(true);

    const response = await loadTopPapers(page);

    const data = await response.json();

    if(response.status===200)
    {
      setPagesCount(Math.floor(data.count/10)); // divide the count by 10 since the page size is 10 to infer the total pages

      setPapers(data.results);
    }
    else{
      toast({
        title: "Error fetching research papers.",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }

    setPageLoading(false);
  }



  const search = async (query) => {
    setPageLoading(true);
    setCurrentQuery(query);

    if(!query)
    {
      setPapers([]);
      fetchPapers(1);
    }

    const response = await searchPapers(query);

    const data = await response.json();

    setPapers([]);

    if(response.status===200)
    {
      setPapers(data);
    }
    else{
      fetchPapers(1);
    }

    setPageLoading(false);
  }

  useEffect(()=> {
    if(!papers.length)
    {
      fetchPapers(1);
    }
  }, [!papers.length])


  return (
    <VStack
      height={"100vh"}
      width="100vw"
      background={"default"}
      className="bg-background"
      padding={"2%"}
      paddingBottom={0}
      overflowX={"hidden"}
      overflowY={"hidden"}
      alignItems={"center"}
    >
      <TopSection searchPapers={search} />

      {
        currentQuery.length
        ?
          <HStack width={"fit-content"} padding={4} gap={1}>
            <Text fontFamily={"sans-serif"}>Found</Text>
            <Text fontFamily={"sans-serif"} fontWeight={600}>{papers.length}</Text> 
            <Text fontFamily={"sans-serif"}>{papers.length !== 1 ? "results" : "result"}</Text>

            <Text>for</Text>
            <Text fontFamily={"gupter"} fontSize={"large"} fontWeight={800}>"{currentQuery}"</Text>
          </HStack>
        :
        null
      }

      {
        pagesCount > 1
        ?
        <HStack
          height={"fit-content"}
          width="100%"
          marginTop={10}
          paddingBottom={0}
        >
          <Spacer />
          <Pagination 
            variant="bordered"
            total={pagesCount} 
            onChange={(p)=>fetchPapers(p)}
            showControls
          />
          <Spacer />
        </HStack>
        :
          null
      }

      <Wrap
        style={{marginTop: 20, scrollbarWidth: "none", overflowY: "scroll", padding: 4}} 
        className="bg-background h-full w-full"
        spacing={50}
      >
          {renderPapers(papers)}
      </Wrap>


   </VStack>
  )

}



export default ResearchPage;
