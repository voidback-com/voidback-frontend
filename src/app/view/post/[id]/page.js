'use client'
import { 
  useState,
  useContext,
  useEffect
} from "react";
import { 
  VStack,
  Text,
  Skeleton,
  HStack,
  Container,
  Stack,
  Spacer,
  useColorMode,
  Divider,
  Show,
  Hide,
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { PostTopBar, PostBottomBar } from "../components/postbars";
import { LeftSection, RightSection } from "@/app/home/components/Sections";
import { AuthContext } from "@/app/providers/AuthProvider";
import { ReadonlyEditor } from "@/app/editor/components/editor";
import { errorToReadable, isAuthenticated, isError } from "@/app/configs/api";
import { Replies } from "../components/replies";
import { MediaSection } from "../components/MediaSection";
import { ParentPostCard, ReplyEditor } from "../components/components";
import { NavBack } from "@/app/research/components/topSection";


export const metdata = {
  title: "Voidback Post",
  description: "Voidback post.",
  referrer: "origin-when-cross-origin",
  keywords: ["finance", "quant", "voidback", "social media", "platform", "voidback login", "fintech", "data-hub", "data broker", "financial data", "realtime data", "stocks", "options", "stock market", "investments", "models", "quantitative analysis"]
}




const ViewPost = ({ params }) => {

  const { id } = params;

  const { 
    getPostById
  } = useContext(LeftFeedContext);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [media, setMedia] = useState(null);



  const router = useRouter();


  const getPost = async () => {
    setLoading(true);

    const data = await getPostById(id);


    if(isError(data))
    {
      if(!data)
        router.push("/404");

      setError(errorToReadable(data));
    }

    else{
      if(!data)
        router.push("/404");
      setPost(data);
    }

    setLoading(false);

  }


  useEffect(()=> {
    if(!post)
    {
      getPost();
    }
  }, [!post])



  const color = useColorMode();


  return (
    <Stack
      className="bg-background"
      overflowX={"hidden"} 
      overflowY={"hidden"}
      width="100%" 
      maxHeight={"100vh"}
      height={"100vh"}
      direction={"row"}
      padding={0}
    >
      <LeftSection currentSelection={"/home"} />
      <VStack
        height={"100%"}
        width="100%"
        overflowX={"hidden"}
        overflowY={"scroll"}
        style={{scrollbarWidth: "none"}}
        padding={"2%"}
        spacing={0}
      >
        <Skeleton 
          isLoaded={!loading}
        >
          <VStack 
            width="80%"
            minW="100%"
            overflow={"hidden"}
          >
            <HStack
              width={"100%"}
              borderRadius={4}
              padding={1}
            >
              <NavBack />
              <Spacer />
            </HStack>

            { post && post.parent_post &&
              <ParentPostCard post={post.parent_post} />
            }

            <Card
              width="50vw"
              variant={"unstyled"}
              backgroundColor={"default"}
              className="bg-background"
            >

              <CardHeader>
                {
                  post
                  &&
                  <PostTopBar post={post} />
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
                <div className="w-full px-10">
                  <ReadonlyEditor content={post.content} />
                </div>
            }

            </CardBody>


              {
                post
                  &&
              <CardFooter className="my-5 flex flex-col">
                <PostBottomBar post={post} />
                <Divider size={"sm"} /> 
              </CardFooter>
              }


            </Card>


            {post ?
              <ReplyEditor parent_post_id={post.id} />
              :
              null
            }

            {/* Replies */}
            {
              post
              &&
              <Replies parent_post_id={post.id} />
            }

          </VStack>
          
        </Skeleton>
     </VStack>

      <Hide breakpoint="(max-width: 1000px)">
        <RightSection />
      </Hide>
    </Stack>
  )
}



export default ViewPost;
