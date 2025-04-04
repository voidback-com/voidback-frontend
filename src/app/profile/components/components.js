'use client'
import { Touchable } from "@/app/auth/components";
import { errorToReadable } from "@/app/configs/api";
import { AuthContext } from "@/app/providers/AuthProvider";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { HStack, VStack, Spacer, Text, useConst, useToast, Wrap } from "@chakra-ui/react";
import { Avatar, Badge, Button, Chip, Card, CardBody, CardFooter, CardHeader, Link, ScrollShadow, Skeleton, Spinner, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { SkewLoader } from "react-spinners";
import AccountCard from "./accountCard";
import { MdVerified } from "react-icons/md";
import { WriteUpCard } from "@/app/home/components/WriteUpCard";
import SeriesCard from "./seriesCard";





export const UserCard = ({username, fullName, avatarUrl, avatar_size, name_size, username_size, isVerified, verified_size, getFollowStatus, isFollowed, hideUsername, textUnderName, isActive, isRound, isPressable, handlePress}) => {



  return (
    <Card className="min-w-fit h-fit border-none bg-transparent" shadow="none" isPressable={isPressable} onPress={handlePress}>
    <CardBody>
      <HStack spacing={2}>
          { isActive
            ?
          <Badge content="" color="success" placement="bottom-right" shape="circle">
            <Avatar className="border-1" name={fullName ? fullName[0] : null} size={avatar_size ? avatar_size : "md"} src={avatarUrl} radius={isRound ?  "full" : "md"} />
          </Badge>
          :
            <Avatar className="border-1" name={fullName ? fullName[0] : null} size={avatar_size ? avatar_size : "md"} src={avatarUrl} radius={isRound ?  "full" : "md"} />
          }

        <VStack spacing={0} alignItems={"center"}>

          <div className="w-full gap-2 flex flex-row left-1 relative">
            <Text
              className="w-full"
              fontSize={name_size ? name_size : "medium"}
              fontWeight={600}
            >
              {fullName}
            </Text>

            {
              isVerified
            ?
              <div className="flex flex-col min-h-[100%] justify-center">
                <MdVerified color="#efca64" size={verified_size} />
              </div>
            :
              null
            }

        </div>


          {
            hideUsername
              ?
              null
              :
          <Link href={`/view/account/${username}`} size={username_size ? username_size : "md"} style={{width: "100%"}}>
              @{username}
          </Link>
          }

          {
            textUnderName
            ?
              textUnderName
            :
              null
          }

        </VStack>

      </HStack>
    </CardBody>
    </Card>
  )
}




export const MyPosts = ({account}) => {
  const { 
    getAccountPosts
  } = useContext(LeftFeedContext);

  const [posts,setPosts] = useState([]);
  const [endReached, setEndReached] = useState(false);
  const [page, setPage] = useState(1);


  const toast = useToast();


  const fetchPosts = async () => {

    const response = await getAccountPosts(account.username, page, "orphan");

    const data = await response.json();

    if(response.status===200)
    {
      if(page>1)
        setPosts(p=>[...p, ...data.results]);
      else
        setPosts(data.results);

      if(!data.next)
        setEndReached(true);
      else
        setPage(page+1);
    }

    else{
      return toast({
        title: "failed to fetch posts!",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }
  }
  
  const vref = useRef();
  const router = useRouter();

  return (
    <VStack
      height={"100%"}
      width={"100%"}
      overflowY={"scroll"}
      style={{scrollbarWidth: "none"}}
    >
      <VStack 
        ref={vref} 
        height={"100%"}
        overflowX={"hidden"}
        overflowY={"scroll"}
        padding={10}
        paddingBottom={"20%"}
        style={{scrollbarWidth: "none"}}
      >
        <InfiniteScroll
          getScrollParent={()=>vref.current}
          element={VStack}
          pageStart={0}
          initialLoad
          hasMore={!endReached}
          loadMore={fetchPosts}
          data={posts}
          loader={
            <HStack
              minWidth={"100%"}
              padding={"2%"}
              paddingBottom={"10%"}
            >
              <Spacer/>
              <Spinner color="default" size="md" />
              <Spacer/>
            </HStack>
          }
          threshold={400}
          useWindow={false}
        >
          { 
            posts.length ?
            posts.map((post)=> {
                return (
                  <HStack className="w-full my-5">
                      <PostCard post={post} />
                  </HStack>
                )

            })

            : <Text fontSize={"small"}>not posts found.</Text>
          }
        </InfiniteScroll>
      </VStack>
    </VStack>
  )

}



export const MySeries = ({account, setSeriesCount}) => {
  const { 
    getAccountSeries
  } = useContext(LeftFeedContext);

  const [series, setSeries] = useState([]);
  const [endReached, setEndReached] = useState(false);
  const [loading, setLoading] = useState(false);


  const toast = useToast();


  const fetchSeries = async () => {

    if(!account || loading || endReached) return;

    setLoading(true);

    const response = await getAccountSeries(account.username);

    const data = await response.json();

    if(response.status===200)
    {
      setSeries(data.results);
      setSeriesCount(data.count);
      setEndReached(true);
    }
    else{
      return toast({
        title: "failed to series!",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }

    setLoading(false);
  }


  return (
    <InfiniteScroll
      className="w-full h-full py-[10vh] gap-6 flex flex-wrap justify-start gap-y-10"
      initialLoad
      hasMore={!endReached}
      loadMore={()=>fetchSeries()}
      data={series}
      loader={
        <HStack
          minWidth={"100%"}
          padding={"2%"}
          paddingBottom={"10%"}
        >
          <Spacer/>
          <Spinner color="default" size="md" />
          <Spacer/>
        </HStack>
      }
      threshold={400}
      useWindow={true}
    >
      { 
        series.length ?
        series.map((s)=> {
          return (
            <SeriesCard series={s} />
          )
        })

        : !loading && <Text fontSize={"small"}>no series found.</Text>
      }
    </InfiniteScroll>
  )

}



export const MyWriteUps = ({account, setWriteUpsCount}) => {
  const { 
    getAccountWriteups
  } = useContext(LeftFeedContext);

  const [writeups, setWriteups] = useState([]);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const [loading, setLoading] = useState(false);


  const toast = useToast();


  const fetchWriteUps = async () => {

    if(!account || loading || endReached) return;

    setLoading(true);

    const response = await getAccountWriteups(account.username, page);

    const data = await response.json();

    if(response.status===200)
    {
      if(page>1)
        setWriteups(p=>[...p, ...data.results]);
      else
        setWriteups(data.results);

      setWriteUpsCount(data.count);

      if(data.next)
        setPage(page+1);
      else
        setEndReached(true);


    }
    else{
      return toast({
        title: "failed to fetch write ups!",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }

    setLoading(false);
  }


  return (
    <InfiniteScroll
      className="w-full h-full py-[10vh] gap-6 flex flex-wrap justify-start gap-y-10"
      initialLoad
      hasMore={!endReached}
      loadMore={()=>fetchWriteUps()}
      data={writeups}
      loader={
        <HStack
          minWidth={"100%"}
          padding={"2%"}
          paddingBottom={"10%"}
        >
          <Spacer/>
          <Spinner color="default" size="md" />
          <Spacer/>
        </HStack>
      }
      threshold={400}
      useWindow={true}
    >
      { 
        writeups.length ?
        writeups.map((w)=> {
          return (
            <WriteUpCard key={w.id} writeup={w} />
          )
        })

        : !loading && <Text fontSize={"small"}>no write ups found.</Text>
      }
    </InfiniteScroll>
  )

}





export const MyLikes = ({account, setLikesCount}) => {
  const { 
    getAccountLikedWriteups
  } = useContext(LeftFeedContext);

  const [writeups, setWriteups] = useState([]);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const [loading, setLoading] = useState(false);


  const toast = useToast();


  const fetchWriteUps = async () => {

    if(!account || loading || endReached) return;

    setLoading(true);

    const response = await getAccountLikedWriteups(account.username, page);

    const data = await response.json();

    if(response.status===200)
    {
      if(page>1)
        setWriteups(p=>[...p, ...data.results]);
      else
        setWriteups(data.results);

      setLikesCount(data.count);

      if(data.next)
        setPage(page+1);
      else
        setEndReached(true);


    }
    else{
      return toast({
        title: "failed to fetch write ups!",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }

    setLoading(false);
  }


  return (
    <InfiniteScroll
      className="w-full h-full py-[10vh] gap-6 flex flex-wrap justify-start gap-y-10"
      initialLoad
      hasMore={!endReached}
      loadMore={()=>fetchWriteUps()}
      data={writeups}
      loader={
        <HStack
          minWidth={"100%"}
          padding={"2%"}
          paddingBottom={"10%"}
        >
          <Spacer/>
          <Spinner color="default" size="md" />
          <Spacer/>
        </HStack>
      }
      threshold={400}
      useWindow={true}
    >
      { 
        writeups.length ?
        writeups.map((w)=> {
          return (
            <WriteUpCard key={w.id} writeup={w} />
          )
        })

        : !loading && <Text fontSize={"small"}>no write ups found.</Text>
      }
    </InfiniteScroll>
  )

}




export const TabBar = ({setCurrent, current, count, setCount}) => {


  const fmt = require("human-readable-numbers");

  return (
    <VStack
      width={"100%"}
      height={"100%"}
      style={{scrollbarWidth: "none"}}
    >
      <HStack>
        <Tabs selectedKey={current} variant="solid">

          <Tab 
            key={"writeups"}
            title={
            <HStack>
              <Text>
               Write Ups
              </Text>

              { current==="writeups" && count ?
                <Chip
                  size="sm"
                  variant="solid"
                >
                  {fmt.toHumanString(count)}
              </Chip>
                :
                null
              }
            </HStack>
          } 
            onFocus={(e)=>{
              setCount(0)
              setCurrent("writeups")
            }} />

          <Tab 
            key={"series"}
            title={
          <HStack>
              <Text className="font-roboto">
                Series
              </Text>

              { current==="series" && count ?
                <Chip
                  size="sm"
                  variant="solid"
                >
                  {fmt.toHumanString(count)}
              </Chip>
                :
                null
              }
          </HStack>
          } onFocus={(e)=>{
              setCount(0);
              setCurrent("series")
            }} />


          <Tab 
            key={"likes"}
            title={
          <HStack>
              <Text className="font-roboto">
                Likes
              </Text>

              { current==="likes" && count ?
                <Chip
                  size="sm"
                  variant="solid"
                >
                  {fmt.toHumanString(count)}
              </Chip>
                :
                null
              }
          </HStack>
          } onFocus={(e)=>{
              setCount(0);
              setCurrent("likes")
            }} />


        </Tabs>
      </HStack>

    </VStack>
  )
}




export const MutualFriends = ({username, modal}) => {

  const [mutuals, setMutuals] = useState(false);
  const [error, setError] = useState(false);


  const { getAccountMutuals } = useContext(AuthContext);

  const fetchMutuals = async () => {

    const response = await getAccountMutuals(username);

    const data = await response.json();


    if(response.status===200)
    {
      if(data && data.length)
      {
        setMutuals(data);
      }
    }
    else{
      setError(errorToReadable(error));
    }
  }

  useEffect(()=> {
    if(!mutuals && !error && username)
    {
      fetchMutuals();
    }
  }, [!mutuals, !error])


  const renderMutuals = () => {

    return mutuals.map((m, i)=> {

      if(i == 2 && mutuals.length > 2)
      return <Link className="font-semibold" color="foreground" size="sm" onPress={modal.onOpen}> and {mutuals.length-i} more...</Link>

      else if(i < 2){
        return (
        <Tooltip
          content={<AccountCard account={m} />}
      >
          <HStack>
          <Link color="foreground" className="font-semibold" size="sm" href={`/view/account/${m.username}`}>
            @{m.username}
                {!(i+1 == mutuals.length) && ", "}
          </Link>

          </HStack>
        </Tooltip>
        )
      }


    })
  }


  if(mutuals && mutuals.length)
  {
    return (
      <HStack
        width="100%"
        padding={2}
      >
        <Text
          fontSize={"small"}
        >
          Followed by 
        </Text>
        {renderMutuals()}
      </HStack>
    )
  }
}


