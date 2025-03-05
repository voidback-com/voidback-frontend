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
import { Chip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { PostTopBar, PostBottomBar } from "../components/postbars";
import { LeftSection, RightSection } from "@/app/home/components/Sections";
import { ReadonlyEditor } from "@/app/editor/components/editor";
import { errorToReadable, isAuthenticated, isError } from "@/app/configs/api";
import { Replies } from "../components/replies";
import { MediaSection } from "../components/MediaSection";
import { ParentPostCard, ReplyEditor } from "../components/components";
import { renderNodes } from "@/app/editor/components/mobileEditorRenderer";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import Link from "next/link";
import { FaStarOfLife } from "@react-icons/all-files/fa/FaStarOfLife";




const ViewPost = ({ params }) => {

  document.title = "View Post";

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
          className="w-full"
        >
          <VStack 
            width="80%"
            minW="100%"
            overflow={"hidden"}
            className="background"
          >
            <HStack
              width={"100%"}
              borderRadius={4}
              padding={2}
            >
              <NavBack />
              <Spacer />
            </HStack>

            { post && post.parent_post &&
              <ParentPostCard post={post.parent_post} />
            }

            <Card
              width="100%"
              backgroundColor={"default"}
              shadow={"none"}
            >

              <CardHeader>

              <HStack className="w-full flex flex-row">
              
                  {post && post.room &&
                   <Link href={`/rooms/${post.room.name}`} className="h-fit w-fit">
                      <Chip
                        className="border-1 bg-background rounded-md "
                      >
                      <HStack className="w-full">
                        <FaStarOfLife size={12} />
                        <Text
                          className="font-semibold text-sm"
                        >
                          {post.room.name}
                        </Text>
                      </HStack>
                    </Chip>
                  </Link>
                  }

                </HStack>


                {
                  post
                  &&
                  <PostTopBar post={post} />
                }
            </CardHeader>

              <CardBody>


            { post && post.room
            &&

               <VStack    
                className="h-fit w-full flex flex-col p-2 gap-0"
                >
                  {
                    post.title &&
                      <Text
                      fontWeight={600}
                      fontSize={24}
                      className={"w-full pb-5"}
                      style={{textAlign: "center"}}
                      fontFamily="sans-serif"
                      >
                          {post.title}
                      </Text>
                  }
              </VStack>

          }



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
                post.from_mobile
                ?
                <div className="px-10 flex flex-wrap gap-1" style={{flexShrink: 1}}>
                  {renderNodes(post.content)}
                </div>
                  :
                    post
                      &&
                    <ReadonlyEditor content={post.content} />
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
              <ReplyEditor parent_post_room={post.room.name} parent_post_id={post.id} />
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
