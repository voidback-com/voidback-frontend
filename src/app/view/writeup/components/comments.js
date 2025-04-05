'use client'
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "@/app/providers/AuthProvider";
import { 
  VStack,
  Spacer,
  HStack,
  Stack,
  Skeleton,
  ModalCloseButton,
  ModalOverlay,
  Modal as ChakraModal,
  ModalBody as ChakraModalBody,
  ModalContent as ChakraModalContent,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Slider,

  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  SkeletonText,
  Link,
  CloseButton,
  Text,
  useToast,
  Wrap
} from "@chakra-ui/react";
import { Card, CardBody, CardFooter, CardHeader, Divider, Chip, Avatar, Button, Textarea, Spinner, DropdownItem, DropdownMenu, Dropdown, DropdownTrigger } from "@nextui-org/react";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { HeartFill, Heart, MessageCircle, ArrowUp, MoreVertical, Flag, Trash } from "@geist-ui/icons";
import { errorToReadable } from "@/app/configs/api";
import InfiniteScroll from "react-infinite-scroller";
import { BsDot } from '@react-icons/all-files/bs/BsDot'





export const CommentCard = ({comment, isReply}) => {

  const [likes, setLikes] = useState(false);
  const [impression, setImpression] = useState(false);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [commentsCount, setCommentsCount] = useState(false);
  const [end, setEnd] = useState(false);
  const [loadingImpressions, setLoadingImpressions] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState(null);
  const [reportMessage, setReportMessage] = useState(null);
  const [reportPriority, setReportPriority] = useState(null);
  const [reportDisturbance, setReportDisturbance] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);


  const reportModal = useDisclosure();
  const deleteModal = useDisclosure();

  const { 
    createComment,
    listComments,
    getCommentsCount,
    getCommentImpressions,
    handleCommentLike,
    submitCommentReport,
    handleDeleteComment
  } = useContext(LeftFeedContext);


  const { account } = useContext(AuthContext);


  const toast = useToast();


  const handleLike = async () => {
    setLoadingImpressions(true);

    const response = await handleCommentLike(comment.id);

    const data = await response.json();

    if(response.status===200)
    {
      setImpression(data.impression);
      setLikes(data.likes);
    }
    else{
      toast({
        title: "Failed to make an impression!",
        description: errorToReadable(data),
        duration: 4000,
        status: "error",
      });
    }

    setLoadingImpressions(false);

  }




  const getImpressions = async () => {
    setLoadingImpressions(true);

    const response = await getCommentImpressions(comment.id);

    const data = await response.json();

    if(response.status===200)
    {
      setLikes(data.likes);
      setImpression(data.impression);
    }
    else{
      toast({
      title: "Failed to fetch impressions!",
      description: errorToReadable(data),
      duration: 4000,
      status: "error",
    });
  }

    setLoadingImpressions(false);
  }



  const getRepliesCount = async () => {
    setCommentsLoading(true);

    const response = await getCommentsCount(comment.writeup, comment.id);

    const data = await response.json();

    if(response.status===200)
    {
      setCommentsCount(data.count);
    }
    else{
      toast({
        title: "Failed to fetch replies!",
        description: errorToReadable(data),
        duration: 4000,
        status: "error",
      });
    }

    setCommentsLoading(false);
  }




  const handleDelete = async () => {

    setDeleteLoading(true);


    const response = await handleDeleteComment(comment.id);

    if(response.status!==200)
    {
      toast({
        title: "Failed to delete the comment!",
        status: "error",
        duration: 3000,
        isClosable: true
      })
    }

    else{
      toast({
        title: "Successfully deleted the comment!",
        status: "success",
        duration: 3000,
        isClosable: true
      });

      deleteModal.onClose();

    }

    setDeleteLoading(false);
  }




  const handleReply = async () => {
    setCommentsLoading(true);

    const response = await createComment(comment.writeup, reply, comment.id);

    const data = await response.json();


    if(response.status===200)
    {
      setCommentsCount(false);
      toast({
        title: "Reply posted successfully!",
        duration: 4000,
        status: "success",
      });
      setPage(1);
      setComments([]);
      setEnd(false);
      fetchComments();
      setReply(null);
    }

    else{
      toast({
        title: "Failed to post reply!",
        description: errorToReadable(data),
        status: "error"
      });
    }

    setComments([]);
    setCommentsLoading(false);
  }


  const fetchComments = async () => {
    setCommentsLoading(true);

    const response = await listComments(comment.writeup, page, comment.id, null);

    const data = await response.json();


    if(response.status===200)
    {
      if(data.results)
      {
        if(page>1)
          setComments(p=>[...p, ...data.results]);

        else
          setComments(data.results);

        if(!commentsCount)
        {
          setCommentsCount(data.count);
        }
      }
      if(!data.next)
      {
        setEnd(true);
      }
      else{
        setPage(page+1);
      }
    }

    else{
      toast({
        title: "Failed to fetch replies!",
        description: errorToReadable(data),
        status: "error"
      });
    }

    setCommentsLoading(false);

  }



  const handleSubmitReport = async () => {

    if(!account) return
    
    setReportLoading(true);

    await submitCommentReport(account.id, comment.id, reportMessage, reportPriority, reportDisturbance)
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
    if(commentsCount===false && !commentsLoading)
    {
      getRepliesCount();
    }
  }, [!commentsCount, !commentsLoading])


  useEffect(()=> {
    if(likes===false && !loadingImpressions)
    {
      getImpressions();
    }
  }, [!likes, !loadingImpressions])



  const fmt = require("human-readable-numbers");

  const hdate = require("human-date");


  const vref = useRef();

  return (

    <VStack
      className="w-full flex flex-col "
      itemScope
      itemType="comment"
    >
      <HStack className="w-[75vw] flex flex-row justify-center">
        <Card
          variant={"unstyled"}
          backgroundColor={"default"}
          className={`bg-background w-full shadow-none border-0`}
        >
          <CardHeader
            className="w-full flex flex-row justify-between p-0"
          >

            <HStack className="w-fit pb-5">
              <VStack>

                <Avatar itemProp="avatar" name={comment.author.full_name[0]} src={comment.author.avatar} size={isReply ? "md" : "lg"} />

              </VStack>

              <VStack>
                <HStack>
                  <Text
                    itemProp="full name"
                    className={`text-md font-semibold text-title ${isReply ? "text-sm" : ""}`}
                  >
                    {comment.author.full_name}
                  </Text>

                  <Text
                    className="text-xs text-gray-500"
                  >
                  {hdate.relativeTime(comment.created_at)}
                </Text>
              </HStack>

                <HStack
                  className="w-full"
                  itemProp="username"
                >
                  <Link href={`/view/account/${comment.author.username}`}>
                    <Text
                      className={`text-sm font-semibold text-gray-500 ${isReply ? "text-xs" : ""}`}
                    >
                      @{comment.author.username}
                    </Text>
                  </Link>
                </HStack>

              </VStack>

              
            </HStack>


            <HStack
              className="w-fit"
            >

              <Dropdown
                showArrow
                radius="sm"
                size="sm"
              >
                <DropdownTrigger
                  className="border-0"
                >
                  <Button
                    disableRipple
                    variant="ghost"
                    className="bg-background border-0 outline-none"
                    isIconOnly
                  >
                    <MoreVertical className="text-gray-500" />
                  </Button>

                </DropdownTrigger>


                <DropdownMenu
                >
                  <DropdownItem
                    key={"report"}
                    startContent={<Flag />}
                    className="font-roboto"
                    onPress={reportModal.onOpen}
                  >
                    Report
                  </DropdownItem>


                  {
                    account && account.username===comment.author.username
                      ?
                     <DropdownItem
                      key={"report"}
                      startContent={<Trash />}
                      className="font-roboto"
                      onPress={deleteModal.onOpen}
                    >
                      Delete
                    </DropdownItem>
                    :
                      null
                  }



                </DropdownMenu>
              </Dropdown>
            </HStack>



            {/* Report Modal */}
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
                    Rate the disturbance caused by this comment
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
                  placeholder="Briefly describe this comment." 
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



          {/* Delete Modal */}
          <ChakraModal
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.onClose}
          >
          <ModalOverlay />

          <ChakraModalContent
            backgroundColor="default"
            width="100%"
            height="80%"
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
                      Delete This Comment!
                  </Text>

                </VStack>

                <Spacer />

                <HStack 
                  width="100%" 
                >
                  <Spacer/>
                  { deleteLoading
                        ?
                        <Spinner color="default" size="md" />
                        :
                    <Button
                      variant="bordered"
                      color="danger"
                      onPress={handleDelete}
                    >
                        Delete
                    </Button>
                  }

              </HStack>

              </VStack>
            </ChakraModalBody>


          </ChakraModalContent>
        </ChakraModal>




        </CardHeader>

          <CardBody className="w-full">
            <Text
              className="font-roboto text-sm"
              itemProp="comment"
            >
              {comment.comment}
            </Text>
          </CardBody>

          <CardFooter
            className="w-full flex flex-row p-2 justify-start"
          >

            <Skeleton
              isLoaded={!loadingImpressions}
              itemProp="likes"
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
              isLoaded={!commentsLoading}

            >
              <Button
                className="border-0"
                size="sm"
                variant="light"
                onPress={()=>setShowReplies(!showReplies)}
                itemProp="replies"
              >
                <HStack>
                  <Text>
                    {fmt.toHumanString(commentsCount)}
                  </Text>
                    <MessageCircle />
                </HStack>
              </Button>
            </Skeleton>


          </CardFooter>
        </Card>
      </HStack>

      <VStack className="border-l-1 rounded-t-xl">
        {
          showReplies
          ?
            <HStack
              className="w-[80vw] flex flex-row justify-center h-fit p-2"
            >
                <HStack
                  className="w-[80vw] h-full justify-center flex flex-row"
                >
                  <Skeleton
                    className="w-full max-w-[500px]"
                    isLoaded={!commentsLoading}
                  >
                    <Textarea
                      size="lg"
                      placeholder="Reply..."
                      className="w-full max-w-[500px]"
                      onChange={(t)=>setReply(t.target.value)}
                    />
                  </Skeleton>


                  <Skeleton
                    isLoaded={!commentsLoading}
                    className="p-2 border-0 rounded-full bg-background self-end w-fit h-fit"
                  >
                    <Button
                      variant="ghost"
                      isIconOnly
                      className="p-2 border-1 rounded-full bg-background self-end w-fit h-fit"
                      radius="full"
                      isDisabled={!reply}
                      onPress={handleReply}
                    >
                      <ArrowUp size={20} />
                    </Button>
                  </Skeleton>
                </HStack>


            </HStack>
          :
          null
        }

        
        {/* Comments Scrolling */}
        { showReplies &&
          <ul
            className="w-full h-full p-5"
            spacing={20}
            ref={(r)=>vref.current=r}
            >
              <InfiniteScroll
                pageStart={1}
                data={comments}
                loadMore={()=>fetchComments()}
                hasMore={!end}
                initialLoad
                className="h-full w-full space-y-5"
                useWindow={false}
                getScrollParent={()=>vref.current}
                loader={
                  <HStack key={0} className="w-full justify-center flex flex-row">
                    <Spinner color="default" size="lg" />
                  </HStack>
                }
              >
                {
                  comments.length ?
                    comments.map((c)=> {
                      return <li
                    >
                      <CommentCard key={c.id} isReply comment={c} />
                    </li>
                    })
                  :
                    null
                }
              </InfiniteScroll>

            </ul>
          }

      </VStack>

      </VStack>
  )
}



