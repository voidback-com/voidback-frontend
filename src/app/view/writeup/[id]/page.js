'use client'
import { 
  useState,
  useContext,
  useEffect,
  useRef
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
  ModalCloseButton,
  ModalOverlay,
  Modal as ChakraModal,
  ModalBody as ChakraModalBody,
  ModalContent as ChakraModalContent,
  useDisclosure,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Slider,

  useToast
} from "@chakra-ui/react";
import { Chip, Avatar, Button, Textarea, Spinner, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { errorToReadable, isAuthenticated, isError } from "@/app/configs/api";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import Link from "next/link";
import NotFound from "@/app/not-found";
import EditorReadOnly from "@/app/editor/editorReadOnly";
import { Touchable } from "@/app/auth/components";
import { ArrowUp, Download, Eye, Flag, Heart, HeartFill } from "@geist-ui/icons";
import InfiniteScroll from "react-infinite-scroller";
import { CommentCard } from "../components/comments";
import { AuthContext } from "@/app/providers/AuthProvider";
import { MdSort } from "@react-icons/all-files/md/MdSort";




const ViewWriteup = ({ params }) => {

  document.title = "Write Up";

  const { id } = params;


  const { 
    getWriteUpById,
    getWriteUpImpressions,
    handleWriteUpLike,
    createComment,
    listComments,
    getCommentsCount,
    submitWriteupReport
  } = useContext(LeftFeedContext);


  const { account } = useContext(AuthContext);


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

  const [reportMessage, setReportMessage] = useState(null);
  const [reportPriority, setReportPriority] = useState(null);
  const [reportDisturbance, setReportDisturbance] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);


  const reportModal = useDisclosure();

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
      setCommentsCount(false);
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

    setComment(null);
    setCommentLoading(false);
  }



  const fetchComments = async () => {
    if(!writeUp) return;

    setCommentsLoading(true);

    const response = await listComments(writeUp.id, page, null, sortBy ? sortBy.key : null);

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
      toast({
        title: "Failed to fetch comments!",
        description: errorToReadable(data),
        status: "error"
      });
    }

    setCommentsLoading(false);

  }


  const fetchCommentsCount = async () => {
    setCommentsLoading(true);

    const response = await getCommentsCount(writeUp.id, null);

    const data = await response.json();


    if(response.status===200)
    {
      setCommentsCount(data.count);
    }
    else{
      toast({
        title: "Failed to fetch comments count!",
        description: errorToReadable(data),
        status: "error"
      });
    }

    setCommentsLoading(false);
  }



  const handleSubmitReport = async () => {

    if(!account) return
    
    setReportLoading(true);

    await submitWriteupReport(account.id, writeUp.id, reportMessage, reportPriority, reportDisturbance)
    .then((res)=> {
        if(res)
        {
          if(res.status!==201)
          {
            toast({
              title: "Failed to submit the report",
              status: "error",
              duration: 3000,
              isClosable: true
            })
          }

          else{
            toast({
              title: "Successfully submited the report",
              description: "thank you for improving the platform.",
              status: "success",
              duration: 3000,
              isClosable: true
            });

            reportModal.onClose();
          }
        }

        else{
          toast({
            title: "Failed to submit the report",
            description: "please try again.",
            status: "error",
            duration: 3000,
            isClosable: true
          })
        }
      })

    setReportLoading(false);
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
  const hdate = require("human-date");

  const vref = useRef();

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

                {
                  writeUp
                    ?

                  <Skeleton
                    isLoaded={!loading}
                  >

                    <Chip className="border-1 bg-default-0 rounded-md">
                      <Text
                        className="text-sm font-semibold text-gray-500"
                      >
                        published on {hdate.prettyPrint(writeUp.created_at)}
                      </Text>
                    </Chip>
                  </Skeleton>
                  :
                    null
                }



                { writeUp && writeUp.series &&
                <Chip onClick={()=>router.push(`/view/account/${writeUp.author.username}`)} className="border-1 bg-default-0 rounded-md">
                  {writeUp.series.name}
                </Chip>
                }
              </HStack>

                {
                  writeUp && writeUp.edited
                    ?

                  <Skeleton
                    isLoaded={!loading}
                  >

                    <Chip className="border-1 bg-default-0 rounded-md">
                      <Text
                        className="text-sm font-bold text-gray-500"
                      >
                        edited
                      </Text>
                    </Chip>
                  </Skeleton>
                  :
                    null
                }


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
                        {fmt.toHumanString(likes)}
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
                        {fmt.toHumanString(views)}
                      </Text>
                      <Eye />
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
                    onPress={reportModal.onOpen}
                  >
                    <Flag />
                  </Button>
                </Skeleton>




                {/* report modal */}

                <ChakraModal
                  isOpen={reportModal.isOpen}
                  onClose={reportModal.onClose}
                >
                <ModalOverlay />

                <ChakraModalContent
                  backgroundColor="default"
                  width="100%"
                  height="80%"
                  maxHeight={"600px"}
                  className="bg-background"
                >
                  <ModalCloseButton />

                  <ChakraModalBody
                    padding={10}
                    height={"100%"}
                    className="bg-background border-1 rounded-md"
                  >
                    <VStack
                      height="100%"
                    >
                      <Spacer/>

                      <VStack
                        padding={4}
                        width="100%"
                      >

                        <Text
                          padding={2}
                          borderRadius={3}
                          fontSize={"xs"}
                          textAlign="center"
                        >
                          Rate the disturbance caused by this write up
                        </Text>


                        <Slider
                          aria-label={['min', 'max']}
                          colorScheme="purple"
                          defaultValue={0}
                          step={10}
                          onChange={(p)=>setReportDisturbance(p)}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>

                          <SliderThumb index={0} />
                        </Slider>

                      </VStack>

                      <Spacer />


                      <VStack
                        width="100%"
                      >
                        <Text
                          padding={2}
                          borderRadius={3}
                          fontSize={"xs"}
                          textAlign="center"
                        >
                          Rate the priority of this report 
                        </Text>


                        <Slider
                          aria-label={['min', 'max']}
                          colorScheme="purple"
                          defaultValue={0}
                          step={10}
                          onChange={(p)=>setReportPriority(p)}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>

                          <SliderThumb index={0} />
                        </Slider>
                      </VStack>


                      <Spacer/>


                      <Textarea
                        onChange={(e)=> {
                          setReportMessage(e.target.value);
                        }}
                        height={"100%"}
                        placeholder="Briefly describe this write up." 
                      />


                      <Spacer/>

                    <HStack 
                        width="100%" 
                      >
                        <Spacer/>
                        { reportLoading
                              ?
                              <Spinner color="default" size="md" />
                              :
                          <Button
                            onClick={handleSubmitReport}
                            isDisabled={!reportMessage}
                          >
                              Submit
                          </Button>
                        }

                    </HStack>

                    </VStack>
                  </ChakraModalBody>


                </ChakraModalContent>
              </ChakraModal>



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

                <Skeleton isLoaded={!commentsLoading}>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="ghost"
                        className="border-0"
                        endContent={<MdSort size={20} />}
                      >
                        {!sortBy ? "Sort By" : sortBy.label }
                      </Button>
                    </DropdownTrigger>


                    <DropdownMenu>
                      <DropdownItem
                        onPress={()=>{
                          setSortBy({label: "My Comments First", key: "my"});    
                          setComments([]);
                          setEnd(false);
                          fetchComments();
                        }}
                      >
                        My Comments First
                      </DropdownItem>

                      <DropdownItem
                        onPress={()=>{
                          setSortBy({label: "Top Comments First", key: "top"});
                          setComments([]);
                          setEnd(false);
                          fetchComments();
                        }}
                      >
                        Top Comments First
                      </DropdownItem>


                      <DropdownItem
                        onPress={()=>{
                          setSortBy({label: "Latest Comments First", key: "latest"});
                          setPage(1);
                          setComments([]);
                          setEnd(false);
                          fetchComments();
                        }}
                      >
                        Latest Comments First
                      </DropdownItem>

                      <DropdownItem
                        onPress={()=>{
                          setSortBy(null);
                          setPage(1);
                          setComments([]);
                          setEnd(false);
                          fetchComments();
                        }}
                      >
                        Unsorted
                      </DropdownItem>


                    </DropdownMenu>
                  </Dropdown>
                </Skeleton>
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

              <Divider />

              {/* Comments Scrolling */}
              <VStack
                className="w-full h-full p-5 overflow-y-scroll"
                spacing={20}
                ref={(r)=>vref.current=r}
              >
                <InfiniteScroll
                  data={comments}
                  initialLoad
                  loadMore={fetchComments}
                  hasMore={!end}
                  className="h-full w-full gap-10 flex flex-col pt-10"
                  threshold={500}
                  useWindow={false}
                  getScrollParent={()=>vref.current}
                >
                  {
                    comments &&
                      comments.map((c)=> {
                        return <CommentCard key={c.id} comment={c} />
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
