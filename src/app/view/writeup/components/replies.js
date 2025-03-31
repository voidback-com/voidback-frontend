import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { 
  Stack, 
  VStack, 
  Text,
  Spacer,
  HStack,
  Button,
  Skeleton,
  SkeletonText,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useState, useEffect, useRef } from "react";
import { SkewLoader, SyncLoader } from "react-spinners";
import InfiniteScroll from "react-infinite-scroller";
import { errorToReadable } from "@/app/configs/api";
import { PostCard } from "@/app/home/components/postCard";
import { Divider } from "@nextui-org/react";




export const Replies = ({parent_post_id}) => {


  const { 
    getPostReplies
  } = useContext(LeftFeedContext);


  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState([]);
  const [error,setError] = useState(null);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);


  const getReplies = async () => {
    setLoading(true);

    const response = await getPostReplies(parent_post_id, page);

    setPage(page+1);

    const data = await response.json();


    if(response.status===200)
    {
      if(data.results.length){
        if(replies.length)
          setReplies(p=>[...p, ...data.results]);
        else
          setReplies(data.results);

        if(!data.next)
          setEndReached(true);
      }
      else{
        setEndReached(true);
      }
    }

    else if(response.status===404)
    {
      setEndReached(true);
    }

    else{
      setError(errorToReadable(error));
    }

    
    setLoading(false);
  }



  const renderReplies = () => {
    return replies.map((reply, i)=> {
      return (
        <VStack key={i} height={"fit-content"} width={"100%"} spacing={0} marginTop={10}>
          <PostCard showContent post={reply} isInFeed={false}/>
        </VStack>
        )
    })
  }


  const vref = useRef();

  return (
    <VStack
      height={"100%"}
      width={"100%"}
    >
      <Skeleton isLoaded={!loading} width={"100%"}>
        <InfiniteScroll
          getScrollParent={()=>vref.current}
          element={VStack}
          initialLoad
          pageStart={0}
          hasMore={!endReached}
          width="100%"
          loadMore={getReplies}
          data={replies}
          loader={
            <HStack
              width="100%"
              padding={"2%"}
              paddingBottom={"10%"}
            >
              <Spacer/>
              <SkewLoader color="mediumpurple" />
              <Spacer/>
            </HStack>
          }
          theshold={1000}
          useWindow={false}
        >
          {renderReplies()}
        </InfiniteScroll>
      </Skeleton>
    </VStack>
  )

}
