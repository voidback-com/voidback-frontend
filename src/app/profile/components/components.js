'use client'
import { Touchable } from "@/app/auth/components";
import { errorToReadable } from "@/app/configs/api";
import { ReadonlyEditor } from "@/app/editor/components/editor";
import { AuthContext } from "@/app/providers/AuthProvider";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { MediaSection } from "@/app/view/post/components/MediaSection";
import { PostBottomBar, PostTopBar } from "@/app/view/post/components/postbars";
import { HStack, VStack, Spacer, Text, useConst, useToast } from "@chakra-ui/react";
import { Avatar, Badge, Button, Card, CardBody, CardFooter, CardHeader, Link, ScrollShadow, Skeleton, Spinner, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { SkewLoader } from "react-spinners";
import AccountCard from "./accountCard";
import { MdVerified } from "react-icons/md";




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
              fontFamily={"sans-serif"}
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
                <Card
                  className="shadow-none rounded-none w-[500px] min-w-[350px] bg-background"
                  style={{borderBottomWidth: 1}}
                  key={post.id}
                >
                  <CardHeader>
                  {
                    post
                    ?
                    <PostTopBar post={post} />
                    : null
                  }
                  </CardHeader>

                  <CardBody className="w-full">
                  {
                    post && post.image || post.video
                    ?
                      <MediaSection video={post.video} image={post.image} />
                    :
                    null
                  }

                  {
                    post
                      &&
                      <Touchable className="place-self-center" onClick={()=>router.push(`/view/post/${post.id}`)}>
                      <ReadonlyEditor content={post.content} />
                    </Touchable>
                  }

                  </CardBody>


                  <CardFooter>
                    {post ?
                      <PostBottomBar post={post} />
                      : null
                    }
                  </CardFooter>

                </Card>
              )
            })

            : <Text fontSize={"small"}>not posts found.</Text>
          }
        </InfiniteScroll>
      </VStack>
    </VStack>
  )

}


export const MyReplies = ({account}) => {
  const { 
    getAccountPosts
  } = useContext(LeftFeedContext);

  const [posts,setPosts] = useState([]);
  const [endReached, setEndReached] = useState(false);
  const [page, setPage] = useState(1);


  const toast = useToast();


  const fetchPosts = async () => {

    const response = await getAccountPosts(account.username, page, "child");

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
        title: "failed to fetch replies!",
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
                <Card
                  className="shadow-none rounded-none w-[500px] min-w-[350px] bg-background"
                  style={{borderBottomWidth: 1}}
                  key={post.id}
                >
                  <CardHeader>
                  {
                    post
                    ?
                    <PostTopBar post={post} />
                    : null
                  }
                  </CardHeader>

                  <CardBody className="w-full">
                  {
                    post && post.image || post.video
                    ?
                      <MediaSection video={post.video} image={post.image} />
                    :
                    null
                  }

                  {
                    post
                      &&
                      <Touchable className="place-self-center" onClick={()=>router.push(`/view/post/${post.id}`)}>
                      <ReadonlyEditor content={post.content} />
                    </Touchable>
                  }

                  </CardBody>


                  <CardFooter>
                    {post ?
                      <PostBottomBar post={post} />
                      : null
                    }
                  </CardFooter>

                </Card>
              )
            })

            : <Text fontSize={"small"}>not posts found.</Text>
          }
        </InfiniteScroll>
      </VStack>
    </VStack>
  )

}





export const MyLikes = ({account}) => {
  const { getAccountLikedPosts } = useContext(LeftFeedContext);

  const [posts,setPosts] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [loading, setLoading] = useState(false);


  const toast = useToast();


  const fetchPosts = async () => {

    if(loading) return;

    setLoading(true);

    if(!posts)
    {
      const response = await getAccountLikedPosts(account.username, 0, 5);

      const data = await response.json();

      if(response.status===200)
      {
        if(data.length)
          setPosts(data);
        else
          setEndReached(true);
      }
      else{
        return toast({
          title: "failed to fetch liked posts!",
          description: errorToReadable(data),
          status: "error",
          duration: 4000
        })
      }

    }

    else{
      const response = await getAccountLikedPosts(account.username, posts.length+1, posts.length+6);

      const data = await response.json();


      if(response.status===200)
      {
        if(data.length)
          setPosts(p=>[...p, ...data]);
        else
          setEndReached(true);
      }

      else{
        return toast({
          title: "failed to fetch liked posts!",
          description: errorToReadable(data),
          status: "error",
          duration: 4000
        })
      }
    }

    setLoading(false);
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
              <Spinner color="default" />
              <Spacer/>
            </HStack>
          }
          threshold={1000}
          useWindow={false}
        >
          { 
            posts ?
            posts.map((post)=> {
              return (
                <Card
                  className="shadow-none border-0 rounded-none w-[500px] min-w-[350px] bg-background"
                  style={{borderBottomWidth: 1}}
                  key={post.id}
                >
                  <CardHeader>
                  {
                    post
                    ?
                    <PostTopBar post={post} />
                    : null
                  }
                  </CardHeader>

                  <CardBody>
                  {
                    post
                    ?
                      <MediaSection video={post.video} image={post.image} />
                    :
                    null
                  }

                  {
                    post
                      &&
                      <Touchable onClick={()=>router.push(`/view/post/${post.id}`)}>
                      <ReadonlyEditor content={post.content} />
                    </Touchable>
                  }

                  </CardBody>


                  <CardFooter>
                    {post ?
                      <PostBottomBar post={post} />
                      : null
                    }
                  </CardFooter>

                </Card>
              )
            })

            : 

              !loading ?
            <Text fontSize={"small"}>not liked posts found.</Text>
            : null
          }
        </InfiniteScroll>
      </VStack>
    </VStack>
  )

}




export const TabBar = ({account, isDifferentAccount}) => {

  const [current, setCurrent] = useState("posts");


  const renderCurrent = () => {
    if(current==="posts"){
      return <MyPosts account={account} />
    }

    else if(current==="likes"){
      return <MyLikes account={account} />
    }

    else if(current==="replies"){
      return <MyReplies account={account} />
    }

  }

  return (
    <VStack
      width={"100%"}
      height={"100%"}
      style={{scrollbarWidth: "none"}}
    >
      <HStack>
        <Tabs variant="bordered">
          <Tab title="Posts" onFocus={(e)=>{setCurrent("posts")}} />

          <Tab title="Replies" onFocus={(e)=>{setCurrent("replies")}} />

          <Tab title="Likes" onFocus={(e)=>{setCurrent("likes")}} />
        </Tabs>
      </HStack>

      <VStack
        width="100%"
        height={"100%"}
        paddingBottom={100}
        style={{scrollbarWidth: "none"}}
      >
        {renderCurrent()}
      </VStack>

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


