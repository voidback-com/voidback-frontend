'use client'
import { PostBottomBar, PostTopBar } from "@/app/view/post/components/postbars";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { ReadonlyEditor } from "@/app/editor/components/editor";
import { MediaSection } from "@/app/view/post/components/MediaSection";
import { renderNodes } from "@/app/editor/components/mobileEditorRenderer";
import { HStack } from "@chakra-ui/react";



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
        className="shadow-none bg-background w-full rounded-none"
        style={{borderBottomWidth: 1}}
      >
        <CardHeader>
          <PostTopBar post={post} />
        </CardHeader>

      <Card
        isPressable
        onPress={()=>router.push(`/view/post/${post.id}`)}
        className="shadow-none border-0 bg-background w-full"
      >
        <CardBody>
        {
          post.image || post.video
          ?
            <MediaSection video={post.video} image={post.image} />
          :
          null
        }

          <ReadonlyEditor content={post.content} />

        </CardBody>
      </Card>

        <CardFooter>
          <PostBottomBar post={post} isInFeed={isInFeed} impressions={impressions} post_replies={post_replies} />
        </CardFooter>

      </Card>

  )
}



