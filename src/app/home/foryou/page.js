'use client'
import { 
  Container, 
  VStack,
  Spacer,
  Stack,
  HStack,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import Sections from "../components/Sections";
import { AuthContext } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroller";
import { useContext, useState, useEffect, useRef } from "react";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { PostCard } from "../components/postCard";
import { AiOutlineRedo } from "@react-icons/all-files/ai/AiOutlineRedo";
import { Button, Divider, Spinner } from "@nextui-org/react";
import { errorToReadable, isError } from "@/app/configs/api";
import PlatformMessage from "../components/platformMessage";









export const ForYouPostsFeed = ({refresh, setRefresh}) => {
  document.title = "For You";

  const { 
    getForYouPosts,

    platformMessage

  } = useContext(LeftFeedContext);


  const { account } = useContext(AuthContext);


  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);


  const router = useRouter();

  useEffect(()=> {
    if(account && account.email_verified==false)
    {
      return router.push("/auth/emailVerification");
    }
  }, [account])



  useEffect(()=> {
    setPosts([]);
    setEnd(false);
    setError(false);
    setRefresh(false);
  }, [refresh]);


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
      if(data && data.length)
      {
        if(posts.length > 0)
        {
          setPosts(p=>[...p, ...data]);
        }
        else
          setPosts([...data]);
      }
      else{
        setEnd(true);
      }
    }
    else{
      setError(errorToReadable(data));

      setEnd(true);
    }

    setLoading(false);
  }


  const vref = useRef();



  const renderPosts = () => {

    return posts.map((post, i)=> {
      return <Stack direction={"column"} className="w-[80%] h-full shadow-none my-5" key={i}><PostCard post={post} isInFeed={true}  /></Stack>
  })
  }


  return (
      <InfiniteScroll
        getScrollParent={()=>vref.current}
        element={VStack}
        style={{scrollbarWidth: "none"}}
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

        {
          platformMessage
          ?
            <PlatformMessage  message={platformMessage} />
          :
          null
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

        {renderPosts()}
      </InfiniteScroll>

  )

}





const Foryou = () => {


  return (
    <Container
      height="100vh"
      minW="100vw"
      padding="0"
    >
      <Sections ActiveFeed={ForYouPostsFeed} feedIndex={0} currentSelection={"/home"} />
    </Container>
  )
}


export default Foryou;


