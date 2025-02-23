'use client'
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { 
  VStack,
  Text,
  useToast,
  HStack,
  Skeleton,
  Spacer,
  Alert,
  AlertIcon,
  Stack,
  Show,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/providers/AuthProvider";
import { RightFeedContext } from "@/app/providers/FeedsProvider/RightFeedProvider";
import { Tabs, Tab, Spinner, Button, Badge, Chip } from "@nextui-org/react";
import { LeftSection, RightSection } from "@/app/home/components/Sections";
import InfiniteScroll from "react-infinite-scroller/dist/InfiniteScroll";
import { AiOutlineRedo } from "@react-icons/all-files/ai/AiOutlineRedo";
import { PostCard } from "@/app/home/components/postCard";
import { ResearchPaperCard } from "@/app/research/components/components";
import AccountCard from "@/app/profile/components/accountCard";




const ExplorePage = ({ params }) => {

  const { query } = params;

  const { account } = useContext(AuthContext);

  document.title = "Explore";

  const { 
    exploreSearch,
    searchLoading,

    exploreSearchCount,

    explorePosts,
    exploreAccounts,
    exploreResearchPapers,
    postsEndReached,
    accountEndReached
  } = useContext(RightFeedContext);


  const [current, setCurrent] = useState("posts");
  const [error, setError] = useState(null);
  const [queryCount, setQueryCount] = useState({"posts": 0, "research": 0, "accounts": 0});



  const fetchMore = async () => {
    const q = decodeURI(query);

    
    if(!searchLoading)
    {
      const counts = await exploreSearchCount(q);

      if(counts){
        setQueryCount(counts);
      }

      const response = await exploreSearch(q, current);

      if(response)
      {
        setError(response);
      }

    }
    
  }


  useEffect(()=> {
    const q = decodeURI(query);

    exploreSearchCount(q)
      .then((counts)=> {
        if(counts){
          setQueryCount(counts);
        }
      })

  }, [query])


  const vref = useRef();


  const renderPosts = () => {

    return (
      <InfiniteScroll
        getScrollParent={()=>vref.current}
        element={VStack}
        style={{scrollbarWidth: "none"}}
        pageStart={0}
        initialLoad
        hasMore={!postsEndReached}
        className="bg-transparent"
        width="100%"
        loadMore={fetchMore}
        data={explorePosts}
        loader={
          <HStack
            width="100%"
            padding={"2%"}
            paddingBottom={"10%"}
          >
            <Spacer/>
            <Spinner size="md" color="default" />
            <Spacer/>
          </HStack>
        }
        threshold={10000}
        useWindow={false}
      >

        {
          explorePosts &&
          explorePosts.map((post)=> {
            return <Stack direction={"column"} className="w-[500px] h-full my-5 shadow-sm"><PostCard post={post} isInFeed={false} /></Stack>
          })
        }

        {
          error
          ?
            <>
              <Alert width={"fit-content"} className="rounded-md" status="error">
                <AlertIcon />
                {error}
                <Spacer />
              </Alert>

              <Button 
                variant="bordered"
                color="default"
                size="sm"
                endContent={<AiOutlineRedo size={20} />}
                onClick={()=>{
                  setEnd(false);
                  setError(null);
                }}
              >
                retry
              </Button>
            </>

          : null
        }
      </InfiniteScroll>
    )
  }

  const renderResearch = () => {

    return (
      <InfiniteScroll
        getScrollParent={()=>vref.current}
        element={VStack}
        style={{scrollbarWidth: "none"}}
        pageStart={0}
        initialLoad
        hasMore={!researchEndReached}
        className="bg-transparent"
        width="100%"
        loadMore={fetchMore}
        data={exploreResearchPapers}
        loader={
          <HStack
            width="100%"
            padding={"2%"}
            paddingBottom={"10%"}
          >
            <Spacer/>
            <Spinner size="md" color="default" />
            <Spacer/>
          </HStack>
        }
        threshold={10000}
        useWindow={false}
      >

        {
          exploreResearchPapers &&
          exploreResearchPapers.map((paper)=> {
            return <Stack direction={"column"} className="w-[500px] h-full my-5 shadow-sm"><ResearchPaperCard paper={paper}/></Stack>
          })
        }

        {
          error
          ?
            <>
              <Alert width={"fit-content"} className="rounded-md" status="error">
                <AlertIcon />
                {error}
                <Spacer />
              </Alert>

              <Button 
                variant="bordered"
                color="default"
                size="sm"
                endContent={<AiOutlineRedo size={20} />}
                onClick={()=>{
                  setEnd(false);
                  setError(null);
                }}
              >
                retry
              </Button>
            </>

          : null
        }
      </InfiniteScroll>
    )

  }

  const renderAccounts = () => {

    return (
      <InfiniteScroll
        getScrollParent={()=>vref.current}
        element={VStack}
        style={{scrollbarWidth: "none"}}
        pageStart={0}
        initialLoad
        hasMore={!accountEndReached}
        className="bg-transparent"
        width="100%"
        loadMore={fetchMore}
        data={exploreAccounts}
        loader={
          <HStack
            width="100%"
            padding={"2%"}
            paddingBottom={"10%"}
          >
            <Spacer/>
            <Spinner size="md" color="default" />
            <Spacer/>
          </HStack>
        }
        threshold={10000}
        useWindow={false}
      >

        {
          exploreAccounts &&
          exploreAccounts.map((usr)=> {
            return <Stack direction={"column"} className="w-[500px] h-full my-5 shadow-sm"><AccountCard account={usr} /></Stack>
          })
        }

        {
          error
          ?
            <>
              <Alert width={"fit-content"} className="rounded-md" status="error">
                <AlertIcon />
                {error}
                <Spacer />
              </Alert>

              <Button 
                variant="bordered"
                color="default"
                size="sm"
                endContent={<AiOutlineRedo size={20} />}
                onClick={()=>{
                  setEnd(false);
                  setError(null);
                }}
              >
                retry
              </Button>
            </>

          : null
        }
      </InfiniteScroll>
    )

  }



  const renderResults = () => {
    switch(current)
    {
      case "posts":
        return renderPosts();

      case "research":
        return renderResearch();

      case "accounts":
        return renderAccounts();

      default:
        return renderPosts();
    }
  }


  const format = require("human-readable-numbers");

  return (
    <HStack
      height={"100vh"}
      width="100%"
      bg={"default"}
      className="bg-background"
      overflow={"hidden"}
      spacing={0}
    >

      <LeftSection currentSelection={"/home"} showNavBack />

      <VStack height={"100%"} width="100%">
        <HStack paddingTop={10} width={"100%"}>
          <Spacer/>
          <Tabs 
            variant="bordered" 
            selectedKey={current} 
            onSelectionChange={(k)=>setCurrent(k)}
          >
            <Tab title={
              <div className="flex items-center space-x-2">
                <span>Posts</span>
                <Chip variant="bordered">{format.toHumanString(queryCount.posts)}</Chip>
              </div>
            } key="posts" />

            <Tab title={
              <div className="flex items-center space-x-2">
                <span>Research</span>
                <Chip variant="bordered">{format.toHumanString(queryCount.research)}</Chip>
              </div>
            } key="research" />

            <Tab title={
              <div className="flex items-center space-x-2">
                <span>Accounts</span>
                <Chip variant="bordered">{format.toHumanString(queryCount.accounts)}</Chip>
              </div>
            } key="accounts" />
          </Tabs>
          <Spacer/>
        </HStack>

        <VStack 
          height={"100%"} 
          width="100%" 
          overflowY={"scroll"}
          overflowX={"hidden"}
          style={{scrollbarWidth: "none"}}
        >
          {renderResults()}
        </VStack>
      </VStack>


      <Show breakpoint="(min-width: 1000px)" style={{display: "none"}}>
        <RightSection />
      </Show>

   </HStack>
  )
}


export default ExplorePage;
