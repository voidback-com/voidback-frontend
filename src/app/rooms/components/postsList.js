'use client'
import { VStack, HStack, Stack, Spacer } from "@chakra-ui/react";
import { 
  useRef
} from "react";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/app/home/components/postCard";
import InfiniteScroll from "react-infinite-scroller";






export const PostsList = ({posts, end, fetchMore}) => {


  const router = useRouter();


  const renderPosts = () => {

    return posts.map((post, i)=> {
      return <Stack direction={"column"} className="w-[80%] shadow-none my-5" key={i}><PostCard post={post} isInFeed={false}  /></Stack>
  })

  }


  return (
      <InfiniteScroll
        element={VStack}
        style={{scrollbarWidth: "none", height: "100%", overflowY: "scroll", paddingBottom: 200, width: "100%"}}
        pageStart={0}
        initialLoad
        hasMore={!end}
        className="bg-transparent"
        width="100%"
        loadMore={fetchMore}
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
        {renderPosts()}
      </InfiniteScroll>
  )
}


