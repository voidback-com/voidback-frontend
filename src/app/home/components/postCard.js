'use client'
import { PostBottomBar, PostTopBar } from "@/app/view/post/components/postbars";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter, Chip } from "@nextui-org/react";
import { ReadonlyEditor } from "@/app/editor/components/editor";
import { MediaSection } from "@/app/view/post/components/MediaSection";
import { renderNodes } from "@/app/editor/components/mobileEditorRenderer";
import { Badge, HStack, Text, VStack } from "@chakra-ui/react";
import { FaStarOfLife } from "@react-icons/all-files/fa/FaStarOfLife";
import Link from "next/link";



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


export const PostCard = ({post, impressions, post_replies, isInFeed=true}) => {

  const router = useRouter();

  if(post.from_mobile)
    return <MobilePostCard post={post} impressions={impressions} post_replies={post_replies} isInFeed={isInFeed} />

  return (
        <Card
          className="shadow-none bg-background w-full rounded-md"
          style={{borderWidth: 1}}
        >

          <CardHeader className="flex flex-col">
          <HStack className="w-full">
          
              {post.room &&
               <Link href={`/room/${post.room.name}`} className="h-fit w-full">
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
                    <Text
                    fontWeight={600}
                    fontSize={16}
                    className={"w-[80%]"}
                    fontFamily="sans-serif"
                    >
                      {post.title && (post.title.endsWith(".") || post.title.endsWith("?") || post.title.endsWith("!")) ? post.title : post.title+'.'}
                    </Text>
              </VStack>
            </Link>

          }


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



