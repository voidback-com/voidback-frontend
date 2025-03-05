'use client'
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { HStack, Show, VStack } from "@chakra-ui/react";
import { Topbar } from "../components/topbar";
import { RoomViewSidebarRight, RoomViewSidebarLeft, Sidebar } from "../components/sidebar";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { usePathname } from "next/navigation";
import { PostsList } from "../components/postsList";



const Page = () => {

  const { getRoomPosts } = useContext(LeftFeedContext);

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [end, setEnd] = useState(false);
  


  const pathname = usePathname();


  const fetchPosts = async () => {

    if(loading || end) return;

    setLoading(true);

    const roomName = pathname.split("/").pop();

    const response = await getRoomPosts(page, roomName);

    const data = await response.json();

    if(response.status===200)
    {
      if(data.results && data.results.length)
      {
        if(page>1)
          setPosts(p=>[...p, ...data.results])
        else
          setPosts(data.results);
      }


      if(!data.next)
        setEnd(true);
      else
        setPage(page+1);
    }
    else {
      setEnd(true);
    }

    setLoading(false);

  }



  return (
    <VStack
      height={"100vh"}
      width="100%"
      bg={"default"}
      className="bg-background flex flex-col"
      overflow={"hidden"}
      spacing={0}
    >
      <Topbar showNavBack />


      <HStack className="h-full w-full flex flex-row p-0">
        <RoomViewSidebarLeft room={pathname ? pathname.split("/").pop() : null } />
        
        <PostsList end={end} posts={posts} fetchMore={fetchPosts} />

        <Show breakpoint="(min-width: 1000px)">
          <RoomViewSidebarRight room={posts.length > 0 ? posts[0]['room'] : null} />
        </Show>
      </HStack>

    </VStack>
 
  )
}


export default Page;
