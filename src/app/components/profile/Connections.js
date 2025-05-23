'use client'
import NotFound from "@/app/not-found";
import { accountCacheGet } from "@/app/utils/api";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { notFound } from "next/navigation";
import { useEffect, useState } from "react"
import { getFollowingUsernameCount, getUsernameFollowers, getUsernameFollowing, getUsernameFollowsCount } from "../helpers/Profile";
import { UserCard } from "../UserCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";




export const AccountsList = ({loadMore, hasMore, loading, accounts, follower=true, showUnfollow=false}) => {


  const renderItem = (item, i) => {
    return <UserCard
      username={follower ? item.follower.username : item.following.username} 
      fullName={follower ? item.follower.full_name : item.following.full_name}
      avatarUrl={follower ? item.follower.avatar : item.following.avatar}
      key={`${item.id}-${i}-${item.created_at}`} 
      showUnfollow={showUnfollow}
    />
  }



  return (
     <div id="scroll-div-comments" className="w-full max-h-[100%] overflow-y-scroll pb-[29vh]">
      <InfiniteScroll
        hasMore={hasMore}
        dataLength={accounts}
        next={loadMore}
        scrollableTarget="scroll-div-comments"
        className="gap-10 flex flex-col"
        loader={<div className="w-full flex flex-row justify-center"><Loader2 className="animate-spin" /></div>}
      >
        {accounts.length ? accounts.map((acc, i)=> renderItem(acc, i)) : null}
      </InfiniteScroll>
      </div>   
  )
}


export const FollowersList = ({username}) => {

  const [count, setCount] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [end, setEnd] = useState(false);


  const num = require("human-readable-numbers");



  const getCount = async () => {

    const res = await getFollowingUsernameCount(username);

    const dat = await res.json();


    if(res.ok)
    {
      setCount(dat.followers);
    }

  }


  const fetchFollowers = async () => {

    if(loading) return;

    setLoading(true);

    const response = await getUsernameFollowers(username, skip, limit);

    if(response.ok)
    {
      const data = await response.json();

      if(data && data.length)
      {
        if(followers.length)
        {
          setFollowers(p=>[...p, ...data]);
        }

        else{
          setFollowers(data);
        }

        setSkip(limit);
        setLimit(l=>l+5);
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


  useEffect(()=> {
    if(!followers.length && !loading && !end)
    {
      fetchFollowers();
    }
  }, [!followers.length, !loading])


  useEffect(()=> {
    if(count===false)
      getCount();
  }, [!count])


  return (
    <Drawer>
      <DrawerTrigger className="text-muted-foreground w-fit flex flex-row gap-2">

        <p className="font-semibold text-foreground">{count!==false ? num.toHumanString(count) : ""}</p> followers
      </DrawerTrigger>


      <DrawerContent>

        <DrawerHeader>
          <DrawerTitle>
            Followers
          </DrawerTitle>
        </DrawerHeader>

        <div className="h-[90svh] p-10">
          <AccountsList 
            hasMore={!end}
            loadMore={fetchFollowers}
            accounts={followers}
          />
        </div>

      </DrawerContent>
    </Drawer>
  )


}



export const FollowingList = ({username}) => {

  const [count, setCount] = useState(false);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [end, setEnd] = useState(false);



  const num = require("human-readable-numbers");



  const getCount = async () => {

    const res = await getUsernameFollowsCount(username);

    const dat = await res.json();


    if(res.ok)
    {
      setCount(dat.follows);
    }

  }


  const fetchFollowing = async () => {

    if(loading) return;

    setLoading(true);

    const response = await getUsernameFollowing(username, skip, limit);

    if(response.ok)
    {
      const data = await response.json();

      if(data && data.length > 0)
      {
        if(following.length)
        {
          setFollowing(p=>[...p, ...data]);
        }

        else{
          setFollowing(data);
        }

        setSkip(limit);
        setLimit(l=>l+5);
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


  useEffect(()=> {
    if(!following.length && !loading && !end)
    {
      fetchFollowing();
    }
  }, [!following.length, !loading])


  useEffect(()=> {
    if(count===false)
      getCount();
  }, [!count])


  return (
    <Drawer>
      <DrawerTrigger className="text-muted-foreground w-fit flex flex-row gap-2">

        <p className="font-semibold text-foreground">{count!==false ? num.toHumanString(count) : ""}</p> following
      </DrawerTrigger>


      <DrawerContent>

        <DrawerHeader>
          <DrawerTitle>
            Following
          </DrawerTitle>
        </DrawerHeader>

        <div className="h-[90svh] p-10">
          <AccountsList 
            hasMore={!end}
            loadMore={fetchFollowing}
            accounts={following}
            follower={false}
            showUnfollow
          />
        </div>

      </DrawerContent>
    </Drawer>
  )


}




export const Connections = ({username}) => {

  const [user, setUser] = useState(username);



  useEffect(()=> {
    const acc = accountCacheGet();

    if(!username && acc)
      setUser(acc.username);

    else
      return notFound();

  }, [!user])



  return (
    <div className="w-fit flex flex-row gap-10 pt-8">
      {
        user
          ?
            <>
              <FollowersList username={user} />
              <FollowingList username={user} />
            </>
        :
          <Loader2 className="animate-spin" />
      }
    </div>
  )

}
