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
  CardFooter,
  SkeletonText,
  useToast
} from "@chakra-ui/react";
import { Chip, Avatar, Button, Textarea } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { errorToReadable, isAuthenticated, isError } from "@/app/configs/api";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import Link from "next/link";
import NotFound from "@/app/not-found";
import EditorReadOnly from "@/app/editor/editorReadOnly";
import { Touchable } from "@/app/auth/components";
import { ArrowUp, Eye, Heart, HeartFill } from "@geist-ui/icons";
import InfiniteScroll from "react-infinite-scroller";
import { CommentCard } from "../components/comments";




const ViewWriteup = ({ params }) => {

  document.title = "Write Up";

  const { id } = params;

  const { 
    getWriteUpById,
    getWriteUpImpressions,
    handleWriteUpLike,
    createComment,
    listComments,
    getCommentsCount
  } = useContext(LeftFeedContext);


  const [loading, setLoading] = useState(false);
  const [loadingImpressions, setLoadingImpressions] = useState(false);
  const [error, setError] = useState(false);
  const [writeUp, setWriteUp] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [impression, setImpression] = useState(false);
  const [likes, setLikes] = useState(false);
  const [views, setViews] = useState(false);
  const [comment, setComment] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(false);
  const [end, setEnd] = useState(false);
  const [page, setPage] = useState(1);



  const router = useRouter();
  const toast = useToast();


  const getWriteup = async () => {
    setLoading(true);

    const response = await getWriteUpById(id);

    const data = await response.json();

    if(response.status===200)
    {
      setWriteUp(data);
    }
    else if(response.status===404){
      setNotFound(true);
    }
    else{
      setError(data);
    }

    setLoading(false);
  }


  useEffect(()=> {
    if(!writeUp)
    {
      getWriteup();
    }
  }, [!writeUp])



  const getImpressions = async () => {
    setLoadingImpressions(true);

    const response = await getWriteUpImpressions(writeUp.id);

    const data = await response.json();

    if(response.status===200)
    {
      setLikes(data.likes);
      setViews(data.views);
      setImpression(data.impression);
    }
    else{
      setError(data);
    }

    setLoadingImpressions(false);
  }


  const handleLike = async () => {
    setLoadingImpressions(true);

    const response = await handleWriteUpLike(writeUp.id);

    const data = await response.json();

    if(response.status===200)
    {
      setImpression(data.impression);
      setLikes(data.likes);
      setViews(data.views);
    }
    else{
      setError(data);
    }

    setLoadingImpressions(false);

  }




  const handleComment = async () => {
    setCommentLoading(true);

    const response = await createComment(writeUp.id, comment, null);

    const data = await response.json();


    if(response.status===200)
    {
      toast({
        title: "Comment posted successfully!",
        duration: 4000,
        status: "success",
      });
      setPage(1);
      setComments(false);
      setEnd(false);
      fetchComments();
    }

    else{
      toast({
        title: "Failed to post comment!",
        description: errorToReadable(data),
        status: "error"
      });
    }

    setCommentLoading(false);
  }



  const fetchComments = async () => {
    if(!writeUp) return;

    setCommentsLoading(true);

    const response = await listComments(writeUp.id, page);

    const data = await response.json();


    if(response.status===200)
    {
      if(data.results)
      {
        if(page>1)
          setComments(p=>[...p, ...data.results]);

        else
          setComments(data.results);
      }
      if(!data.next)
      {
        setEnd(true);
      }
      else{
        setPage(p=>p+1);
      }
    }

    else{
      // error handle
    }

    setCommentsLoading(false);

  }


  const fetchCommentsCount = async () => {
    setCommentsLoading(true);

    const response = await getCommentsCount(writeUp.id);

    const data = await response.json();


    if(response.status===200)
    {
      setCommentsCount(data.count);
    }
    else{
      // error handle
    }

    setCommentsLoading(false);
  }


  useEffect(()=> {
    if(writeUp && !impression && !likes && !views)
    {
      getImpressions();
    }
  }, [writeUp, !likes, !views, !impression])



  useEffect(()=> {
    if(writeUp && commentsCount===false && !commentsLoading)
    {
      fetchCommentsCount();
    }
  }, [!commentsCount, !commentsLoading, writeUp])


  if(notFound)
  {
    return NotFound();
  }


  const fmt = require("human-readable-numbers");


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

              <HStack className="w-[80%]">
                <Spacer />
                { writeUp && writeUp.series &&
                <Chip onClick={()=>router.push(`/view/account/${writeUp.author.username}`)} className="border-1 bg-default-0 rounded-md">
                  {writeUp.series.name}
                </Chip>
                }
              </HStack>
              <Spacer />
            </HStack>

            <HStack className="w-[85%] pb-5">
              { writeUp &&
                <>
              <VStack>

                <Avatar name={writeUp.author.full_name[0]} src={writeUp.author.avatar} size="lg" />

              </VStack>

              <VStack>
                <Text
                  className="text-md font-semibold text-title"
                >
                  {writeUp.author.full_name}
                </Text>

                <Link href={`/view/account/${writeUp.author.username}`}>
                  <Text
                    className="text-sm font-semibold text-gray-500"
                  >
                    @{writeUp.author.username}
                  </Text>
                </Link>


              </VStack>
              </>
              }

              <Spacer />

              <HStack>


                <Skeleton
                  isLoaded={!loadingImpressions}
                >
                  <Button
                    className="border-0"
                    size="sm"
                    variant="light"
                    onPress={handleLike}
                  >
                    <HStack>
                      <Text>
                        {likes}
                      </Text>
                      { impression===1
                        ?
                        <HeartFill />
                        :
                        <Heart />
                      }
                    </HStack>
                  </Button>
                </Skeleton>


                <Skeleton
                  isLoaded={!loadingImpressions}
                >
                  <Button
                    className="border-0"
                    size="sm"
                    variant="light"
                  >
                    <HStack>
                      <Text>
                        {views}
                      </Text>
                      <Eye />
                    </HStack>
                  </Button>
                </Skeleton>

              </HStack>

            </HStack>


            <Divider />

            <HStack className="py-5">
              <SkeletonText isLoaded={!loading}>
                <Text
                  fontSize={"20pt"}
                  className="font-abril text-writeup"
                >
                  {writeUp && writeUp.title}
                </Text>
              </SkeletonText>
            </HStack>


            <VStack className="h-full w-[80%] max-w-[800px] border-0">
              { writeUp &&
                <EditorReadOnly content={writeUp.content} />
              }
            </VStack>

            <Divider />

            <VStack
              className="w-full h-full p-5"
            >


              <HStack
                className="w-full p-5"
              >
                <SkeletonText
                  isLoaded={!commentsLoading}
                >
                  <Text
                    className="font-roboto font-bold text-2xl"
                  >
                    Comments
                  </Text>
                </SkeletonText>

                <SkeletonText
                  isLoaded={!commentsLoading}
                >
                  <Text className="font-roboto font-semibold text-2xl" >
                    {commentsCount && fmt.toHumanString(commentsCount)}
                  </Text>
                </SkeletonText>
              </HStack>


              <HStack
                className="w-1/2 h-full justify-center flex flex-row"
              >
                <Skeleton
                  className="w-full max-w-[500px]"
                  isLoaded={!commentLoading}
                >
                  <Textarea
                    size="lg"
                    placeholder="Comment..."
                    className="w-full max-w-[500px]"
                    onChange={(t)=>setComment(t.target.value)}
                  />
                </Skeleton>


                <Skeleton
                  isLoaded={!commentLoading}
                  className="p-2 border-0 rounded-full bg-background self-end w-fit h-fit"
                >
                  <Button
                    variant="ghost"
                    isIconOnly
                    className="p-2 border-1 rounded-full bg-background self-end w-fit h-fit"
                    radius="full"
                    isDisabled={!comment}
                    onPress={handleComment}
                  >
                    <ArrowUp size={20} />
                  </Button>
                </Skeleton>
              </HStack>


              {/* Comments Scrolling */}
              <VStack
                className="w-full h-full min-h-[50vh] p-5"
                spacing={20}
              >
                <InfiniteScroll
                  data={comments}
                  loadMore={fetchComments}
                  hasMore={!end}
                  className="h-full w-full gap-10 flex flex-col pt-10"
                  threshold={500}
                >
                  {
                    comments &&
                      comments.map((c)=> {
                        return <CommentCard comment={c} />
                      })
                  }
                </InfiniteScroll>

              </VStack>


            </VStack>

          </VStack>
          
        </Skeleton>
     </VStack>
    </Stack>
  )
}



export default ViewWriteup;
