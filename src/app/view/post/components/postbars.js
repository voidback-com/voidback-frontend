'use client'
import { 
  useState,
  useContext,
  useEffect
} from "react";
import { 
  Text,
  HStack,
  Stack,
  Spacer,
  VStack,
  Button,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  AbsoluteCenter,
  ModalCloseButton,
  ModalBody,
  useToast,
  Slider,
  Skeleton,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Textarea
} from "@chakra-ui/react";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { AuthContext } from "@/app/providers/AuthProvider";
import { MdMoreHoriz } from "@react-icons/all-files/md/MdMoreHoriz";
import { useRouter } from "next/navigation";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";
import { FaUserAltSlash } from "@react-icons/all-files/fa/FaUserAltSlash";
import { Link, User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { FaHeart } from "@react-icons/all-files/fa/FaHeart";
import { FaRegHeart } from "@react-icons/all-files/fa/FaRegHeart";
import { IoHeartDislikeSharp } from "@react-icons/all-files/io5/IoHeartDislikeSharp";
import { IoHeartDislikeOutline } from "@react-icons/all-files/io5/IoHeartDislikeOutline";
import { UserCard } from "@/app/profile/components/components";
import { MessageCircle, Eye, Share, AlertCircle, Copy, Mail } from '@geist-ui/icons';
import { isAuthenticated, isError } from "@/app/configs/api";



export const PostTopBar = ({post}) => {

  const { account, follow, isFollowed, unfollow } = useContext(AuthContext);


  const { 
    submitPostReport,
    deletePost,
  } = useContext(LeftFeedContext);


  const [followed, setFollowed] = useState(false);
  const [reportDisturbance, setReportDisturbance] = useState(0);
  const [reportPriority, setReportPriority] = useState(0);
  const [reportMessage, setReportMessage] = useState("");
  const [toggleForwardMessage, setToggleForwardMessage] = useState(false);


  const toast = useToast();


  const hdate = require("human-date");


  const report = useDisclosure();
  const deleteModal = useDisclosure();
  const shareModal = useDisclosure();


  const getFollowStatus = async () => {

    const response = await isFollowed(post.author.username);

    if(response)
    {
      setFollowed(2);
    }
    else{
      setFollowed(1);
    }

  }

  useEffect(()=> {
    if(post && account && followed===false)
    {
      if(post.author.username == account.username)
      {
        setFollowed(2);
      }
      else{
        getFollowStatus();
      }
      
    }
  }, [!followed])



  const handleSubmitReport = async () => {

    if(!isAuthenticated())
    {
      toast({
        title: "Please login first.",
        status: "warning",
        duration: 4000,
        isClosable: true
      })
      return
    }

    const response = await submitPostReport(post.id, reportMessage, reportPriority, reportDisturbance, account.username);

    if(response.status!==201)
    {
      toast({
        title: "Failed to submit the report",
        description: "Something went wrong, please try again!",
        status: "error",
        duration: 4000,
        isClosable: true
      })
    }

    else{
      toast({
        title: "Successfully submited the report",
        description: "thank you for improving the platform.",
        status: "success",
        duration: 4000,
        isClosable: true
      });

        report.onClose();
      }
  }


  const handleDelete = () => {


    deletePost(post.id).then((res)=> {
        if(res && res.error)
        {
          toast({
            title: "Failed to delete the post",
            description: "please try again.",
            status: "error",
            duration: 3000,
            isClosable: true
          });
          deleteModal.onClose();
        }

        else{
          toast({
            title: "Successfully deleted the post",
            status: "success",
            duration: 3000,
            isClosable: true
          });
          deleteModal.onClose();
        }
    })
      
  }



  const copylink = () => {
    navigator.clipboard.writeText(document.URL);
    toast({
      title: "Successfully copied the link to your clipboard!",
      status: "success",
      duration: 3000,
      isClosable: true
    })
  }




  return (
     <HStack
      width="100%"
      overflow={"hidden"}
      padding={"2%"}
      spacing={0}
    >
        <Stack 
          direction={"row"}
          width="fit-content"
        > 
            <Skeleton isLoaded={post}>
              <UserCard
                username={post.author.username}
                fullName={post.author.full_name}
                avatarUrl={post.author.avatar}
                isVerified={post.author.isVerified}
              />
                  
            </Skeleton>


            <Skeleton isLoaded={followed}>
            { followed===1 ?
              <HStack
                padding={4}
              >
                <Button
                  size={'xs'}
                  onClick={()=>{
                    follow(post.author.username);
                    setFollowed(2);
                  }}
                >
                  <Text>follow</Text>
                </Button>
              </HStack>

              : null
            }
            </Skeleton>

          <Stack />

        </Stack>

        <Spacer/>

        <HStack>
          <Text
            color="lightslategrey"
            fontSize={"small"}
            textTransform={"lowercase"}
          >
            {post && hdate.relativeTime(post.created_at)}
          </Text>

          <Spacer/>
            <Divider orientation="vertical" height={"20px"} />
          <Spacer/>


          <Dropdown className="bg-background border-1">
            <DropdownTrigger>
              <Button variant={"light"}>
                <MdMoreHoriz size={25} />
              </Button>
            </DropdownTrigger>
            
            <DropdownMenu aria-label="menu-post">

            {
              followed===2 && post.author.username !== account?.username ?
            
             <DropdownItem
                key={"unfollow"}
                endContent={<FaUserAltSlash size={25}/>}
                onPress={()=> {
                    setFollowed(1);
                    unfollow(post.author.username);
                }}
              >
                <HStack>
                  <Text>
                      Unfollow
                  </Text>

                  <Text
                    color="lightslategrey"
                  >
                    @{post.author.username}
                  </Text>
                </HStack>
              </DropdownItem>

              : null
            }


              <DropdownItem
                key={"share"}
                endContent={<Share size={20}/>}
                onPress={shareModal.onOpen}
              >
                Share
              </DropdownItem>


              <DropdownItem
                key={"report"}
                endContent={<AlertCircle size={20}/>}
                onPress={report.onOpen}
                isDisabled={!isAuthenticated()}
              >
                Report
              </DropdownItem>



              {
                account && post.author.username===account.username &&
                <DropdownItem
                  key={"delete"}
                  endContent={<MdDelete color="tomato" size={25}/>}
                  onClick={deleteModal.onOpen}
                  className="text-red-400"
                >
                  Delete post
                </DropdownItem>
              }

            </DropdownMenu>

          </Dropdown>



          <Modal
            isOpen={shareModal.isOpen}
            onClose={shareModal.onClose}
          >
            <ModalOverlay />

            <ModalContent
              backgroundColor={"default"}
              className="bg-background"
              width="100%"
                key={"h"}
            >
              <ModalCloseButton />

              <ModalBody
                className="bg-background border-1 rounded-md"
                padding={10}
                height={"100%"}
              >
                <VStack
                  height="100%"
                >

                  <Button
                    size="sm"
                    onClick={copylink}
                  >
                    Copy link to clipboard
                    <Spacer width="1vw" />

                    <Copy size={20} />
                  </Button>


                  <Box position="relative" padding="4" width={"100%"}>
                    <Divider />
                    <AbsoluteCenter px="4">
                      <Text
                        fontFamily={"monospace"}
                        fontWeight={"semibold"}
                      >
                        OR
                      </Text>
                    </AbsoluteCenter>
                  </Box>

                <Button
                  size="sm"
                  onClick={()=>setToggleForwardMessage(!toggleForwardMessage)}
                  // isDisabled={!isAuthenticated()}
                  isDisabled
                  // dm not yet implemented
                >
                    Forward to friends
                    <Spacer width="1vw" />

                    <MessageCircle size={20} />
                  </Button>

                  <Spacer />

                  {
                    toggleForwardMessage

                    ?
                      <VStack>
                      {/* implement an editor and send a dm message with the post attached */}
                      </VStack>
                    :
                    null
                  }


                </VStack>
              </ModalBody>

            </ModalContent>
          </Modal>






          <Modal
            isOpen={report.isOpen}
            onClose={report.onClose}
          >
            <ModalOverlay />

            <ModalContent
              backgroundColor="default"
              className="bg-background"
              width="100%"
              height="80%"
              maxHeight={"600px"}
            >
              <ModalCloseButton />

              <ModalBody
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
                      Rate the disturbance caused by this post
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
                    placeholder="Briefly describe this post" 
                  />


                  <Spacer/>

                <HStack 
                    width="100%" 
                  >

                    <Spacer/>
                    <Button
                      onClick={handleSubmitReport}
                    >
                        Submit
                    </Button>

                </HStack>

                </VStack>
              </ModalBody>


            </ModalContent>
          </Modal>


          <Modal
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.onClose}
          >
            <ModalOverlay />

            <ModalContent
              width="100%"
              backgroundColor={"default"}
            >

              <ModalBody
                padding={8}
                height={"100%"}
                className="bg-background border-1 rounded-md"
              >
                <VStack
                  height="100%"
                >
                  <VStack
                  >
                    <Text
                      fontWeight={"semibold"}
                    >
                      Are you sure?
                    </Text>
                  <Spacer/>
                    <Text
                      color={"lightslategrey"}
                      fontFamily={"sans-serif"}
                      fontSize={"small"}
                    >
                      This action is irreversible, once a post is deleted it ceases to exist on the platform.
                    </Text>
                  </VStack>

                  <Spacer/>
                  <Spacer/>

                  <HStack
                    width="60%"
                  >
                    <Button color={"tomato"}
                      onClick={handleDelete}
                      size={"sm"}
                    >
                      Delete
                    </Button>

                    <Spacer/>

                    <Button
                      onClick={deleteModal.onClose}
                      size={"sm"}
                    >
                      Cancel
                    </Button>
                  </HStack>

                </VStack>
              </ModalBody>


            </ModalContent>
          </Modal>
        </HStack>
    </HStack>
  )

}



export const PostBottomBar = ({post, isInFeed}) => {

  const { 
    // insert: like, dislike, viewedPost
    likePost,
    deleteLikePost,
    dislikePost,
    deleteDislikePost,
    viewPost,

    // retrieve: postLikes, postDislikes, postViews, postImpression
    getCommentsCount,

    postImpressions,

    postAccountImpression,

    getPostRepliesCount


  } = useContext(LeftFeedContext);



  const [likes, setLikes] = useState(null);
  const [dislikes, setDislikes] = useState(null);
  const [impression, setImpression] = useState(false);
  const [loading, setLoading] = useState(false);
  const [repliesCount, setRepliesCount] = useState(null);

  const [views, setViews] = useState(0);

  const format = require("human-readable-numbers");



  const getMyImpression = async () => {

    const myImpression = await postAccountImpression(post.id);

    if(myImpression.status===200)
    {
      const imp = await myImpression.json();

      if(myImpression)
      {
        setImpression(imp.impression);
      }
      else{
        if(!isInFeed)
          viewPost(post.id);

        setImpression(0);
      }
    }

    setLoading(false);

  }

  const getImpressions = async () => {
    const imps = await postImpressions(post.id);


    if(imps)
    {
      setLikes(imps.likes);
      setDislikes(imps.dislikes);
      setViews(imps.views);
    }

    setLoading(false);
  }


  const getRepliesCount = async () => {

    const data = await getPostRepliesCount(post.id);

    if(!isError(data))
    {
      setRepliesCount(data.replies);
    }

  }


  useEffect(()=> {
    if(likes===null || dislikes===null || views===null)
    {
      if(!loading)
        getImpressions();
    }
  }, [!likes, !dislikes, !views])



  useEffect(()=> {
    if(repliesCount===null)
    {
      if(!loading)
        getRepliesCount();
    }
  }, [!repliesCount])



  useEffect(()=> {
    if(impression===false)
    {
      if(!loading)
        getMyImpression();
    }
  }, [!impression])



  const toast = useToast();


  const handleLike = () => {

    if(!isAuthenticated())
    {
      toast({
        title: "please login to like the post.",
        description: "you are currently unauthenticated!",
        status: "warning",
        duration: 4000
      })
      return;
    }

    setLoading(true);

    if(impression===1)
    {
      deleteLikePost(post.id);

      setLikes(likes-1);
      
      setImpression(0);

    }


    else if(impression===-1)
    {
      deleteDislikePost(post.id);

      setDislikes(dislikes-1);

      likePost(post.id);

      setLikes(likes+1);

      setImpression(1);

    }

    else{
      likePost(post.id);

      setLikes(likes+1);

      setImpression(1);

    }


    setLoading(false);
  }

  
  const handleDislike = () => {

    if(!isAuthenticated())
    {
      toast({
        title: "please login to dislike the post.",
        description: "you are currently unauthenticated!",
        status: "warning",
        duration: 4000
      })
      return;
    }


    setLoading(true);

    if(impression===-1)
    {
      deleteDislikePost(post.id);

      setDislikes(dislikes-1);

      setImpression(0);
    }

    else if(impression===1)
    {
      deleteLikePost(post.id);
      dislikePost(post.id);

      setLikes(likes-1);

      setDislikes(dislikes+1);

      setImpression(-1);

    }

    else{
      dislikePost(post.id);

      setDislikes(dislikes+1);

      setImpression(-1);
    }
    
    setLoading(false);
  }





  const router = useRouter();


  console.log(impression)

  return (
    <VStack
      width="100%"
      height="fit-content"
      alignSelf={"center"}
    >

      <Spacer/>

      <Skeleton width={"100%"} isLoaded={(!loading && likes!==null && dislikes!==null && views!==null)}>
          <HStack
            width="100%"
          >
            <Spacer />

            <Button
              onClick={handleLike}
              backgroundColor={"transparent"}
              _hover={{backgroundColor: "transparent", opacity: "70%"}}
            >
              <HStack>

                { impression===1 ? <FaHeart size={20} color="tomato" /> : <FaRegHeart size={20} color="tomato" /> }
                <Text
                  color="lightslategrey"
                  fontWeight={400}
                >
                  {format.toHumanString(likes)}
                </Text>
              </HStack>
            </Button>

            <Spacer />


            <Button
              onClick={handleDislike}
              _hover={{backgroundColor: "transparent", opacity: "70%"}}
              backgroundColor={"transparent"}
            >
              <HStack>

                { impression===-1 ? <IoHeartDislikeSharp size={20} color="tomato" /> : <IoHeartDislikeOutline size={20} color="tomato" /> }

                <Text
                  color="lightslategrey"
                  fontWeight={400}
                >
                  {format.toHumanString(dislikes)}
                </Text>

              </HStack>
            </Button>

            <Spacer />

            <Button
              onClick={()=>router.push(`/view/post/${post.id}`)}
              _hover={{backgroundColor: "transparent", opacity: "70%"}}
              backgroundColor={"transparent"}
            >
              <HStack>
              <MessageCircle size={20} />

                <Text
                  color="lightslategrey"
                  fontWeight={400}
                >
                  {format.toHumanString(repliesCount)}
                </Text>

              </HStack>
            </Button>

            <Spacer />

            <Button
              onClick={()=>router.push(`/view/post/${post.id}`)}
              _hover={{backgroundColor: "transparent", opacity: "70%"}}
              backgroundColor={"transparent"}
            >
              <HStack>
                <Eye size={20} />
                <Text
                  color="lightslategrey"
                  fontWeight={400}
                >
                  {post && format.toHumanString(views)}
                </Text>
              </HStack>
            </Button>


            <Spacer />
          </HStack>
        </Skeleton>


      <Spacer/>
      <Spacer/>

  </VStack>
  )
}



