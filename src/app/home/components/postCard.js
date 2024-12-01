'use client'
import { PostBottomBar, PostTopBar } from "@/app/view/post/components/postbars";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { ReadonlyEditor } from "@/app/editor/components/editor";
import { MediaSection } from "@/app/view/post/components/MediaSection";





export const PostCard = ({post, impressions, post_replies, isInFeed=true}) => {

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
