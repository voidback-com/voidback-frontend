'use client'
import { useContext, useEffect, useRef, useState } from "react";
import { Divider, HStack, Show, VStack, Spacer, useToast } from "@chakra-ui/react";
import { LeftSection, RightSection } from "../home/components/Sections";
import { SidebarContext } from "../providers/FeedsProvider/SidebarProvider";
import NotificationCard from "./components/NotificationCard";
import InfiniteScroll from "react-infinite-scroller/dist/InfiniteScroll";
import { Button, Spinner } from "@nextui-org/react";
import { Delete } from "@geist-ui/icons";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../configs/api";




const NotificationsPage = () => {


  const router = useRouter();

  const toast = useToast();

  useEffect(()=> {
    if(!isAuthenticated())
    {
      if(!toast.isActive(2))
        toast({
          title: "You have to login to view your Notifications!",
          status: "info",
          duration: 5000,
          isClosable: true,
          id: 2
        })
      return router.replace("/home/foryou");
    }
  }, [])


  const [notifications, setNotifications] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [endReached, setEndReached] = useState(false);
  const [failedFetch, setFailedFetch] = useState(false);


  const { getNotifications, deleteAllNotifications } = useContext(SidebarContext);



  const clearAll = async () => {
    const response = await deleteAllNotifications();

    if(response.status===200)
    {
      setNotifications([]);
      toast({
        title: "Successfully cleared all notifications.",
        duration: 4000,
        status: "success"
      })
    }
  }


  const fetchMore = async () => {

    const data = await getNotifications(skip, limit);

    if(data){

      if(!data.length)
      {
        setEndReached(true);
        return
      }

      if(notifications.length)
      {
        setNotifications(p=>[...p, ...data]);
        setSkip(limit+1);
        setLimit(skip+5);
      }
      else{
        setNotifications(data);
        setSkip(limit+1);
        setLimit(skip+5);
      }
    }
    else{
      setEndReached(true);
      setFailedFetch(true);
    }

  }

  const handleRemove = async (nid) => {
    setNotifications(n=>n.filter(({id})=>id!==nid));
  }


  const renderNotifications = () => {
    return notifications.map((data)=> {
      return( 
        <VStack
          height={"100%"}
        >
          <NotificationCard handleRemove={handleRemove} key={data.id} data={data} />
          <Divider />
        </VStack>
      );
    })
  }


  const vref = useRef();


  return (
    <div className="bg-background w-[100vw] h-[100vh]">
      <HStack
        height={"100vh"}
        width={"100vw"}
      >
        <LeftSection showNavBack currentSelection={"/notifications"} />

        <VStack
          width={"100%"}
          height={"100%"}
        >
          <HStack
            paddingTop={10}
          >
            <Button onPress={clearAll} variant="bordered" size="sm" endContent={<Delete size={20} color="default" />}>
              clear all
            </Button>
          </HStack>

          <Spacer />


          <VStack
            height={"100%"}
            width={"100%"}
            overflowY={"scroll"}
          >
            <InfiniteScroll
              getScrollParent={()=>vref.current}
              element={VStack}
              style={{scrollbarWidth: "none"}}
              pageStart={0}
              initialLoad
              hasMore={!endReached}
              className="bg-transparent"
              width="100%"
              loadMore={fetchMore}
              data={notifications}
              loader={
                <HStack
                  width="100%"
                  padding={"2%"}
                  paddingBottom={"10%"}
                >
                  <Spacer />
                  <Spinner size="md" color="default" />
                  <Spacer />
                </HStack>
              }
              threshold={1000}
              useWindow={false}
            >
              {renderNotifications()}
            </InfiniteScroll>
          </VStack>
        </VStack>

      <Show breakpoint="(min-width: 1000px)" style={{display: "none"}}>
        <RightSection />
      </Show>
      </HStack>
    </div>
  )
}



export default NotificationsPage;
