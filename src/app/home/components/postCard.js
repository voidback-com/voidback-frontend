'use client'
import { PostBottomBar, PostTopBar } from "@/app/view/post/components/postbars";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter, Chip, Button } from "@nextui-org/react";
import { ReadonlyEditor } from "@/app/editor/components/editor";
import { MediaSection } from "@/app/view/post/components/MediaSection";
import { renderNodes } from "@/app/editor/components/mobileEditorRenderer";
import { Badge, HStack, Text, VStack } from "@chakra-ui/react";
import { FaStarOfLife } from "@react-icons/all-files/fa/FaStarOfLife";
import Link from "next/link";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/app/providers/AuthProvider";




export const MobilePostCard = ({post, impressions, post_replies, isInFeed=true}) => {

  const router = useRouter();


  return (
      <Card
        className="shadow-none bg-background w-full rounded-none"
        style={{borderBottomWidth: 1}}
      >
        <CardHeader>
          <PostTopBar post={post} />
        </CardHeader>

      <Card
        isPressable
        onPress={()=>router.push(`/view/post/${post.id}`)}
        className="shadow-none border-0 bg-transparent w-full"
      >
        <CardBody>
        {
          post.image || post.video
          ?
            <MediaSection video={post.video} image={post.image} />
          :
          null
        }
          <div className="px-10 flex flex-wrap gap-1" style={{flexShrink: 1}}>
            {renderNodes(post.content)}
          </div>

        </CardBody>
      </Card>

        <CardFooter>
          <PostBottomBar post={post} isInFeed={isInFeed} impressions={impressions} post_replies={post_replies} />
        </CardFooter>

      </Card>

  )
}


export const PostCard = ({showContent, post, impressions, post_replies, isInFeed=true, noBorder}) => {

  const [loading, setLoading] = useState(false);
  const [membership, setMembership] = useState(false);


  const { getMembership, joinEdgeRoom } = useContext(LeftFeedContext);
  const { account } = useContext(AuthContext);




  const fetchMembership = async () => {
    if(!post || loading || membership) return;

    setLoading(true);

    const response = await getMembership(post.room.name);

    const data = await response.json();

    if(response.status===200)
    {
      setMembership(data);
    }

    setLoading(false);
  }


  const handleJoin = async () => {
    const response = await joinEdgeRoom({
      account: account.id,
      permissions: post.room.config.default_member_permissions,
      room: post.room.id
    });

    if(response.status===200)
    {
      await fetchMembership();
    }
  }



  useEffect(()=> {
    if(post && !loading && !membership)
      fetchMembership();
  }, [!membership])


  const checkIsMember = () => {

    if(!account) return 1;

    if(!membership && !loading && account)
    {
      if(account.username===post.room.config.admin.username)
        return true;

      else
        return false;
    }
    else if(membership)
    {
      return true;
    }

    else{
      return false;
    }
  }


  if(post.from_mobile)
    return <MobilePostCard post={post} impressions={impressions} post_replies={post_replies} isInFeed={isInFeed} />

  return (
        <Card
          className="shadow-none bg-background w-full rounded-md"
          style={{borderWidth: noBorder ? 0 : 1}}
        >

          <CardHeader className="flex flex-col">
          <HStack className="w-full flex flex-row justify-between">
          
              {post.room &&
               <Link href={`/rooms/${post.room.name}`} className="h-fit w-full">
                  <Chip
                    className="border-1 bg-background rounded-md "
                  >
                  <HStack className="w-full">
                    <FaStarOfLife size={12} />
                    <Text
                      className="font-semibold text-sm"
                      fontFamily={"Inter"}
                    >
                      {post.room.name}
                    </Text>
                  </HStack>
                </Chip>
              </Link>
              }


              {

              !checkIsMember()
            ?
              <Button size="sm" variant="bordered" color="default" className="rounded-full border-1" onPress={()=>handleJoin()}>
                join
              </Button>
            :
              null
              }
            </HStack>

            <PostTopBar post={post} />

          </CardHeader>

          <CardBody className="p-0">

            { post.room
            &&

             <Link href={`/view/post/${post.id}`} className="h-fit w-full">
               <VStack    
                className="h-fit w-full flex flex-col p-2 gap-0"
                >
                  {
                    post.title
                    &&
                    <Text
                    fontWeight={600}
                    fontSize={20}
                    className={"w-[100%] pb-5"}
                    style={{textAlign: "center"}}
                    fontFamily="sans-serif"
                    >
                      {post.title}
                    </Text>
                  }
              </VStack>
            </Link>

          }


        {showContent && post.content
        ?
          <ReadonlyEditor content={post.content} />
        :null}


          {
            post.image || post.video
            ?
              <MediaSection video={post.video} image={post.image} />
            :
            null
          }

          </CardBody>

          <CardFooter>
            <PostBottomBar post={post} isInFeed={isInFeed} impressions={impressions} post_replies={post_replies} />
          </CardFooter>

        </Card>

  )
}



