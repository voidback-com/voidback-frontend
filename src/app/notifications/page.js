'use client'

import { useEffect, useState } from "react"
import { NavigationBar } from "../components/Navigation"
import { deleteAllNotifications, getNotifications, readNotifications } from "../components/helpers/Notifications";
import { useMediaQuery } from "react-responsive";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeletons } from "../components/writeUpList";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserCard } from "../components/UserCard";
import { WriteUpCard } from "../components/writeUpList/Card";
import { CommentCard } from "../components/writeUp/Comment-card";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errorToReadable } from "../utils/api";
import { useToast } from "@/hooks/use-toast";



const RenderObject = ({type, obj}) => {


  switch(type)
  {
    case "writeup":
      return <WriteUpCard
        noBorder
        writeup={obj}
        snippet
      />;


    case "comment":
      return <CommentCard noBorder comment={obj} />;


    default:
      return null;
  }
}



const NotificationCard = ({item, index}) => {

  const { from, object, objectType } = item.content;

  return (
    <Card className={`w-full ${index===0 ? "border-t" : "border-b"} rounded-none shadow-none`}>
      <CardHeader className="p-5">
        <UserCard 
          username={from.username}
          fullName={from.full_name}
          avatarUrl={from.avatar}
          verified={from.isVerified}
        />

        <div className="w-full flex flex-row justify-center">
        <p className="font-semibold text-large">{item.content.title}</p>
        </div>
      </CardHeader>

      <CardContent className="w-[98%] place-self-center">
        <div className="p-5 border rounded-xl">
          <RenderObject type={objectType} obj={object} />
        </div>
      </CardContent>
    </Card>
  )
}



const NotificationsList = ({notifications, loadMore, hasMore}) => {

  const renderItem = (item, i) => {
    return <NotificationCard item={item} index={i} key={item.id} />
  }


  return (
    <div id="scroll-div" className={`w-full max-h-[100%] overflow-y-scroll pb-[19vh]`}>
      <InfiniteScroll
        hasMore={hasMore}
        dataLength={notifications.length}
        next={loadMore}
        scrollableTarget="scroll-div"
        loader={<Skeletons size={5} />}
      >
        {notifications.length ? notifications.map((notification, i)=> renderItem(notification, i)) : null}

        {notifications.length===0 && !hasMore ? <div className="w-full text-muted-foreground font-semibold flex flex-row justify-center p-5"><p>0 notifications found</p></div> : null}
      </InfiniteScroll>
      </div>
  )
}



export default function Page() {


  const [notifications, setNotifications] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [read, setRead] = useState(false);
  const [hasMore, setHasMore] = useState(true);


  const fetchNotifications = async () => {
    if(loading) return;

    setLoading(true);

    const data = await getNotifications(skip, limit, false);

    console.log(data);

    if(data && data.length)
    {
      if(notifications.length)
        setNotifications(p=>[...p, ...data]);

      else
        setNotifications(data);


      setSkip(limit);
      setLimit(limit+10);
    }
    else{
      setHasMore(false);
    }

    setLoading(false);
  }


  useEffect(()=> {
    if(!read)
    {
      readNotifications();
      setRead(true);
    }
  }, [!read])


  const { toast } = useToast();


  const handleClear = async () => {
    const res = await deleteAllNotifications();

    if(res.ok)
    {
      toast({
        title: "successfully deleted all notifications!"
      });
      setNotifications([]);
    }

    else{
      toast({
        title: "Failed to deleted notifications!",
        description: errorToReadable(await res.json())
      })
    }
  }


  useEffect(()=> {
    if(!notifications.length && hasMore && !loading)
    {
      fetchNotifications();
    }
  }, [hasMore, !notifications.length])


  return (
    <div className="w-full h-[100svh]">

      <NavigationBar selected="notifications" feed={
        <div className="w-full h-[100svh] p-0">
          {notifications.length ? (
            <div className="pt-5 pb-5 flex flex-row justify-center">
              <Button variant="outline" onClick={()=>handleClear()}>Clear <Trash /></Button>
              </div>
          )
            : null}
          
          <NotificationsList 
            notifications={notifications}
            loadMore={fetchNotifications}
            hasMore={hasMore}
          />
        </div>
      } />
    </div>
  )
}
