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
  useToast,
  HStack,
  Spacer,
  Skeleton,
  IconButton,
  ModalOverlay,
  ModalCloseButton,
  Modal as ChakraModal,
  ModalBody as ChakraModalBody,
  ModalContent as ChakraModalContent,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Slider
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/providers/AuthProvider";
import { MutualFriends, TabBar, UserCard } from "@/app/profile/components/components";
import { MdLink } from "react-icons/md";
import { Touchable } from "@/app/auth/components";
import { Input, User, Link, Button, Divider, useDisclosure, Modal, ModalHeader, ModalContent, ModalBody, Avatar, Textarea, Card, CardBody, CardHeader, Tooltip } from "@nextui-org/react";
import InfiniteScroll from "react-infinite-scroller";
import { errorToReadable, isAuthenticated } from "@/app/configs/api";
import { NavBack } from "@/app/research/components/topSection";
import AccountCard from "@/app/profile/components/accountCard";
import { Flag } from "@geist-ui/icons";




const ViewAccount = ({ params }) => {

  const { username } = params;

  const auth = useContext(AuthContext);

  const { 
    getAccountByUsername, 
    getUsernameFollowers,
    getUsernameFollowing,
    getUsernameFollowingCount,
    submitAccountReport,
    } = auth;





  const [account, setAccount] = useState(false);
  const [endFetch, setEndfetch] = useState(false);


  const toast = useToast();

  const router = useRouter();

  
  const getAccount = async () => {

    if(auth.account)
    {
      if(auth.account.username === username)
      {
        return router.push("/profile");
      }
    }


    const response = await getAccountByUsername(username);

    const data = await response.json();


    if(response.status===200)
    {
      setAccount(data);
    }
    else{
      setEndfetch(true);
      toast({
        title: "Error fetching account!",
        description: errorToReadable(data),
        status: "warning",
        duration: 4000
      })
    }

  }


  useEffect(()=> {
    if(!account && !endFetch)
    {
      getAccount();
    }
  }, [!account, !endFetch])


  const [followingCount, setFollowingCount] = useState(false);
  const [followersCount, setFollowersCount] = useState(account?.rank);

  const [followers, setFollowers] = useState(false);
  const [following, setFollowing] = useState(false);


  const [reportDisturbance, setReportDisturbance] = useState(0);
  const [reportPriority, setReportPriority] = useState(0);
  const [reportMessage, setReportMessage] = useState("");




  const fetchFollowing = async () => {

    if(!following)
    {
      const response = await getUsernameFollowing(username, 0, 10);


      const data = await response.json();

      if(response.status===200)
      {
        setFollowing(data);
      }
      else{
        setFollowing([]);
      }

    }
    else{
      const response = await getUsernameFollowing(username, following.length+1, following.length+10);

      const data = await response.json();

      if(response.status===200)
      {
        setFollowing(p=>[...p, ...data]);
      }
      else{
        setFollowing([]);
      }
    }

    const countResponse = await getUsernameFollowingCount(username);

    const countData = await countResponse.json();

    if(countResponse.status===200)
    {
      setFollowingCount(countData.following);
    }

  }



  const fetchFollowers = async () => {

    if(!followers)
    {
      const response = await getUsernameFollowers(username, 0, 10);

      const data = await response.json();

      if(response.status===200)
      {
        setFollowers(data);
      }
      else{
        setFollowers([]);
      }

    }
    else{
      const response = await getUsernameFollowers(username, followers.length+1, followers.length+11);

      const data = await response.json();

      if(response.status===200)
      {
        setFollowers(p=>[...p, ...data]);
      }
      else{
        setFollowers([]);
      }
    }

  }


  useEffect(()=> {
    if(account)
    {
      if(!following)
        fetchFollowing();

      if(!followers)
        fetchFollowers();

      setFollowersCount(account.rank);
    }
  }, [account, !followers, !following])



  const reportModal = useDisclosure();


  const handleSubmitReport = () => {

    if(!account) return


    submitAccountReport(account.id, reportMessage, reportPriority, reportDisturbance)
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
  }



  const followersModal = useDisclosure();

  const followingModal = useDisclosure();

  const format = require("human-readable-numbers");

  const vref = useRef();

  return (
    <VStack
      height={"100vh"}
      width="100%"
      bg={"default"}
      className="bg-background"
      overflow={"hidden"}
      spacing={0}
      padding={10}
    >


      <HStack
        width={"100%"}
        padding={2}
      >
        <NavBack />

        <Skeleton 
          isLoaded={!account ? false : true}
        >

          { account &&
            <AccountCard 
              account={account}
              size="lg"
              verified_size={19}
            />
          }
        </Skeleton>

      </HStack>


      {/* Followers and Following */}
     <HStack
      padding={1}
      spacing={5}
      width={"95%"}
    >
      {/* Followers */}
      <HStack
        spacing={1}
      >
        <Skeleton isLoaded={followers}>
          <Touchable>
            <Text
              fontSize={"small"}
              fontWeight={900}
            >
              {followersCount > 0 ? format.toHumanString(followersCount) : "0"}
            </Text>
          </Touchable>
        </Skeleton>

        <Skeleton isLoaded={followers}>
          <Touchable
              onClick={followersModal.onOpen}
            >
            <Text
              fontSize={"small"}
              color={"lightslategrey"}
              fontFamily={"sans-serif"}
              fontWeight={600}
            >
              Followers
            </Text>
          </Touchable>
        </Skeleton>
      </HStack>


      {/* Following */}
       <HStack
        spacing={1}
        width={"100%"}
      >
        <Skeleton isLoaded={following}>
          <Touchable>
            <Text
              fontSize={"small"}
              fontWeight={900}
            >
              {followingCount > 0 ? format.toHumanString(followingCount) : "0"}
            </Text>
          </Touchable>
        </Skeleton>

        <Skeleton isLoaded={following}>
          <Touchable
            onClick={followingModal.onOpen}
          >
            <Text
              fontSize={"small"}
              color={"lightslategrey"}
              fontFamily={"sans-serif"}
              fontWeight={600}
            >
              Following
            </Text>
          </Touchable>
        </Skeleton>
      </HStack>


      <Spacer />

      <Skeleton 
        width="fit-content"
        isLoaded={!account ? false : true}
      >
        <Tooltip
          content="Report Account"
        >
          <Button
            size="sm"
            variant="light"
            onPress={reportModal.onOpen}
            isDisabled={!isAuthenticated()}
          >
            <Flag />
          </Button>
        </Tooltip>
      </Skeleton>
      <Spacer />

    </HStack>



    {/* Mutuals friends */}
    <Skeleton isLoaded={!account ? false : true} className="w-[95%]">
      {
        account.username ?
      <MutualFriends username={account.username} modal={followersModal} />
        :null
      }
    </Skeleton>



    {/* posts, research, likes */}
    <Skeleton height={"100%"} width={"100%"} isLoaded={!account ? false : true}>
        { account &&
        <TabBar account={account} isDifferentAccount />
        }
    </Skeleton>


      {/* followers Modal */}

    <Modal 
      isOpen={followersModal.isOpen}
      onOpenChange={followersModal.onOpenChange}
    >

      <ModalContent
        className="h-1/2 w-1/2 bg-background border-1"
      >

        {(onClose)=> (
            <>

              <ModalHeader>
                <Text
                  fontSize={"medium"}
                  fontFamily={"sans-serif"}
                  fontWeight={600}
                >
                  Followers
                </Text>
              </ModalHeader>

              <ModalBody
                height={"100%"}
                style={{scrollbarWidth: "none", overflowY: "scroll"}}
              >
                <InfiniteScroll
                  element={VStack}
                  pageStart={0}
                  style={{paddingBottom: 100, overflowY: "scroll"}}
                  hasMore={!followersCount===followers.length}
                  width="100%"
                  loadMore={fetchFollowers}
                  data={followers}
                  getScrollParent={()=>vref.current}
                >
                    {
                        followers.map(({follower})=> {
                          return <AccountCard account={follower} />
                        })
                    }

                    {!followers.length ? <Text fontSize={"small"}>no followers found.</Text> : null}
                </InfiniteScroll>
              </ModalBody>
            </>
          )}
      </ModalContent>
    </Modal>


    {/* following Modal */}

    <Modal 
      isOpen={followingModal.isOpen}
      onOpenChange={followingModal.onOpenChange}
    >

      <ModalContent
        className="h-1/2 w-1/2 bg-background border-1"
        style={{scrollbarWidth: "none", overflowY: "scroll"}}
      >

        {(onClose)=> (
            <>

              <ModalHeader>
                <Text
                  fontSize={"medium"}
                  fontFamily={"sans-serif"}
                  fontWeight={600}
                >
                  Following
                </Text>
              </ModalHeader>

              <ModalBody
                height={"100%"}
                style={{scrollbarWidth: "none"}}
              >
                <InfiniteScroll
                  element={VStack}
                  pageStart={0}
                  style={{paddingBottom: 100}}
                  hasMore={!followingCount===following.length}
                  loadMore={fetchFollowing}
                  data={following}
                  getScrollParent={()=>vref.current}
                >
                    {
                        following.map((f)=> {
                          return <AccountCard account={f.following} />
                        })
                    }

                    {!following.length ? <Text fontSize={"small"}>not following anyone.</Text> : null}
                </InfiniteScroll>
              </ModalBody>
            </>
          )}
      </ModalContent>
    </Modal>



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
                  Rate the disturbance caused by this account
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
                placeholder="Briefly describe this account." 
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
          </ChakraModalBody>


        </ChakraModalContent>
      </ChakraModal>



   </VStack>
  )
}



export default ViewAccount;
