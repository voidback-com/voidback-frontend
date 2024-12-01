'use client'
import { LeftSection, RightSection } from "@/app/home/components/Sections";
import PostsContext from "@/app/providers/FeedsProvider/PostsContext";
import { useContext, useRef, useState } from "react";
import { 
  VStack,
  Stack,
  Spacer,
  HStack,
  Text,
  Skeleton,
  useColorMode,
  useDisclosure,
  Alert,
  Show,
  AlertIcon,
  useColorModeValue
} from "@chakra-ui/react";
import { errorToReadable } from "@/app/configs/api";
import { Button, Spinner } from "@nextui-org/react";
import InfiniteScroll from "react-infinite-scroller/dist/InfiniteScroll";
import { AiOutlineRedo } from "@react-icons/all-files/ai/AiOutlineRedo";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { PostCard } from "@/app/home/components/postCard";
import { RefreshCcw } from "@geist-ui/icons";





const Symbol = ({ params }) => {

  const { symbol } = params;

  const { 
    getSymbolPosts, 

    getPostsRepliesCount,
    postsImpressions,

  } = useContext(LeftFeedContext);

  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [endReached, setEndReached] = useState(false);
  const [error, setError] = useState(false);
  const [repliesCount, setRepliesCount] = useState([]);
  const [impressions, setImpressions] = useState([]);


  const getPosts = async () => {
    const response = await getSymbolPosts(symbol, skip, limit);
    const data = await response.json();

    if(response.status===200)
    {
      if(data.length){
        if(!posts.length)
          setPosts(data);
        else
          setPosts(p=>[...p, ...data]);
        setSkip(limit+1);
        setLimit(skip+5);


        const c = await getPostsRepliesCount(data);

        if(repliesCount.length && c)
          setRepliesCount(i=>[...i, ...c]);
        else if(c){
          setRepliesCount(c);
        }

        const imps = await postsImpressions(data);

        if(impressions.length && imps){
          setImpressions(i=>[...i, ...imps]);
        }
        else if(imps){
          setImpressions(imps);
        }


      }

      else
        setEndReached(true);
    }
    else{
      setError(errorToReadable(data));
    }
  }


  const refresh = () => {
    setSkip(0);
    setLimit(5);
    setPosts([]);
    setEndReached(false);
    setImpressions([]);
    setRepliesCount([]);
  }



  const vref = useRef();


  const renderPosts = () => {

    return posts.map((post, i)=> {
      return <Stack direction={"column"} className="w-8/12 h-full shadow-none"><PostCard post={post} key={post.id} post_replies={repliesCount[i]} impressions={impressions[i]} /></Stack>
    })
  }



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

        <Button
          className="my-5"
          size="sm"
          variant="bordered"
          color="default"
          endContent={<RefreshCcw size={18} />}
          onPress={refresh}
        >
          refresh
        </Button>



        <VStack height={"100%"} width="100%" overflowY={"scroll"} style={{scrollbarWidth: "none"}}>


          <InfiniteScroll
          getScrollParent={()=>vref.current}
          element={VStack}
          style={{scrollbarWidth: "none"}}
          pageStart={0}
          initialLoad
          hasMore={!endReached}
          width="100%"
          loadMore={getPosts}
          data={posts}
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
          threshold={1000}
          useWindow={false}
        >

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
                  color="default"
                  size="sm"
                  endContent={<AiOutlineRedo size={20} />}
                  onClick={()=>{
                    setEndReached(false);
                    setError(null);
                  }}
                >
                  retry
                </Button>
              </>

            : null
          }

          {renderPosts()}
        </InfiniteScroll>
        </VStack>
      </VStack>


      <Show breakpoint="(min-width: 1000px)" style={{display: "none"}}>
        <RightSection />
      </Show>

   </HStack>
  )
}



export default Symbol;
