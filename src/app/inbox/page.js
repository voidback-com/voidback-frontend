'use client'
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { 
  VStack,
  HStack,
  Spacer,
  useToast,
  Text
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LeftSection } from "../home/components/Sections";
import { InboxFilter, PostCard } from "./components/components";
import { SidebarContext } from "@/app/providers/FeedsProvider/SidebarProvider";
import InfiniteScroll from "react-infinite-scroller";
import { SkewLoader } from "react-spinners";
import { AuthContext } from "../providers/AuthProvider";
import { errorToReadable, isAuthenticated } from "../configs/api";
import { Spinner } from "@nextui-org/react";



const InboxPage = () => {

  const router = useRouter();

  useEffect(()=> {
    if(!isAuthenticated())
      return router.push("/home")
  }, [])


  const { account } = useContext(AuthContext);


  const { getInbox } = useContext(SidebarContext);



  const [inbox, setInbox] = useState([]);


  const [endreached, setEndReached] = useState(false);
  const [page, setPage] = useState(1);



  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxError, setInboxError] = useState(null);

  const [order, setOrder] = useState("desc");
  const [from, setFrom] = useState("all");



  const toast = useToast();


  useEffect(()=> {
    if(inboxError)
    {
      toast({
        title: "An error occurred!",
        description: inboxError,
        status: "error",
        duration: 3000
      })
    }
  }, [inboxError])



  const fetchInbox = async () => {

    if(endreached) return;
    if(inboxLoading) return;

    setInboxLoading(true);


    if(!inbox.length)
    {
      const response = await getInbox(page);

      const data = await response.json();

      if(response.status===200)
      {
        setInbox(data.results);
        if(data.next)
          setPage(page+1);
        else
          setEndReached(true);
      }

      else{
        setInboxError(errorToReadable(data));
        setEndReached(true);
      }

    }

    else{
      const response = await getInbox(page);

      const data = await response.json();

      if(response.status===200)
      {
        setInbox(p=>[...p, ...data.results]);

        if(data.next)
          setPage(page+1);
        else
          setEndReached(true);
      }

      else{
        setInboxError(errorToReadable(data));
        setEndReached(true);
      }

    }
    
    setInboxLoading(false);
  }


  const renderInboxItems = () => {

    if(!inbox.length && !inboxLoading)
      return <div className="w-full flex flex-row justify-center py-10"><Text fontSize={"medium"} fontWeight={600}>Inbox is empty!</Text></div>

    return ( 
      inbox.filter((a)=>{
          if(from==="all")
          {
            return true;
          }

          else if(a.from_account.username===from)
            return true;

          else
            return false;
        }).sort((a,b)=>{
          let adate = new Date(a.created_at);
          let bdate = new Date(b.created_at);

          if(order==="asc")
          {
            if(adate > bdate)
              return adate
            else
              return -1
          }

          else{
            if(adate > bdate)
              return -1
            else
              return adate
          }
        }).map(({post, from_account, caption, id, created_at})=> {
        return (
          <PostCard 
                key={id} 
                id={id}
                from={from_account} 
                post={post} 
                caption={caption}
                account={account}
                created_at={created_at}
              />
        )
      })
    )
  }


  const vref = useRef();


  return (
    <HStack
      background={"default"} 
      className="bg-background"
      overflowX={"hidden"} 
      overflowY={"hidden"}
      width="100vw" 
      maxHeight={"100vh"}
      height={"100%"}
      direction={"row"}
      padding={0}
      style={{scrollbarWidth: "none"}}
    >
      <LeftSection currentSelection={"/inbox"} />

      <VStack
        marginTop={10}
        direction={"column"}
        height={"100vh"}
        width="100vw"
        padding={0}
        style={{scrollbarWidth: "none"}}
      >
        <HStack
          width="100%"
        >
          <Spacer/>

          <InboxFilter order={order} setOrder={setOrder} from={from} setFrom={setFrom} inbox={inbox} />

          <Spacer/>
        </HStack>




        <VStack
          height="100vh"
          overflowY="scroll"
          paddingBottom="10%"
          style={{scrollbarWidth: "none", width: "100%"}}
        >
          <InfiniteScroll
            getScrollParent={()=>vref.current}
            element={VStack}
            initialLoad
            pageStart={0}
            hasMore={!endreached}
            width="100%"
            loadMore={fetchInbox}
            data={inbox}
            style={{width: "100%"}}
            loader={
              <HStack
                width="100%"
                padding={"2%"}
                paddingBottom={"10%"}
              >
                <Spacer/>
                <Spinner color="default" size="md" />
                <Spacer/>
              </HStack>
            }
            threshold={1000}
            useWindow={false}
          >
            {renderInboxItems()}
          </InfiniteScroll>

        </VStack>
      </VStack>


    </HStack>
  )
}



export default InboxPage;
