'use client'
import { HStack, Show, Spacer, Stack, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import InfiniteScroll from "react-infinite-scroller";
import { isError } from "../configs/api";
import { PostCard } from "../home/components/postCard";
import { AuthContext } from "../providers/AuthProvider";
import { LeftFeedContext } from "../providers/FeedsProvider/LeftFeedProvider";
import { RoomsSidebarRight, Sidebar } from "./components/sidebar";
import { Topbar } from "./components/topbar";
import { Spinner } from "@nextui-org/react";




const Page = () => {


  const { 
    getForYouPosts
  } = useContext(LeftFeedContext);


  const { account } = useContext(AuthContext);


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);


  const router = useRouter();


  useEffect(()=> {
    if(account && account.email_verified==false)
    {
      return router.push("/auth/emailVerification");
    }
  }, [account])



  const getExclude = () => {
    let ex = [];

    posts.map((p)=> {
      ex.push(p.id);
    })

    return ex;
  }


  const fetchPosts = async () => {

    if(loading) return null;

    setLoading(true);

    const data = await getForYouPosts(getExclude())


    if(!isError(data))
    {
      if(data && data.length > 0)
      {
        if(posts.length > 0)
        {
          setPosts(p=>[...p, ...data]);
        }
        else
          setPosts(data);
      }
      else{
        setEnd(true);
      }
    }
    else{
      setEnd(true);
    }

    setLoading(false);
  }


  const renderPosts = () => {

    return posts.map((post, i)=> {
      return <Stack direction={"column"} className="w-[80%] h-full shadow-none my-5" key={i}><PostCard post={post} isInFeed={false}  /></Stack>
  })
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
      <Topbar setPosts={setPosts} showNavBack />

      <HStack className="w-full h-full">
        <Sidebar />

        <HStack className="w-full h-full">
          <InfiniteScroll
            element={VStack}
            style={{height: "100%", scrollbarWidth: "none", overflowY: "scroll", paddingBottom: 200}}
            pageStart={0}
            initialLoad
            hasMore={!end}
            className="bg-transparent"
            width="100%"
            loadMore={fetchPosts}
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
        </HStack>

        <Show breakpoint="(min-width: 1000px)">
          <RoomsSidebarRight />
        </Show>
      </HStack>
    </VStack>
  )
}


export default Page;
