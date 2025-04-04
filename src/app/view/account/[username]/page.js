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
  Slider,
  useDisclosure as useChakraDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/providers/AuthProvider";
import { MutualFriends, MyLikes, MySeries, MyWriteUps, TabBar, UserCard } from "@/app/profile/components/components";
import { MdLink } from "react-icons/md";
import { Touchable } from "@/app/auth/components";
import { Input, User, Link, Button, Divider, useDisclosure, Modal, ModalHeader, ModalContent, ModalBody, Avatar, Textarea, Card, CardBody, CardHeader, Tooltip } from "@nextui-org/react";
import InfiniteScroll from "react-infinite-scroller";
import { errorToReadable, isAuthenticated } from "@/app/configs/api";
import AccountCard from "@/app/profile/components/accountCard";
import { Flag } from "@geist-ui/icons";
import { NavBack } from "@/app/globalComponents/buttonFunctions";





const ViewAccount = ({ params }) => {



  const { username } = params;

  document.title = username;

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
    //
    // if(auth.account)
    // {
    //   if(auth.account.username === username)
    //   {
    //     return router.push("/profile");
    //   }
    // }


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
  const [reportLoading, setReportLoading] = useState(false);




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



  const reportModal = useChakraDisclosure();


  const handleSubmitReport = async () => {

    if(!account || reportLoading) return

    setReportLoading(true);


    await submitAccountReport(account.id, reportMessage, reportPriority, reportDisturbance)
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


  const [current, setCurrent] = useState("writeups");
  const [count, setCount] = useState(0);


  const renderCurrent = () => {

    if(current==="writeups")
    {
      return <MyWriteUps setWriteUpsCount={setCount} account={account} />
    }

    else if(current==="series")
    {
      return <MySeries setSeriesCount={setCount} account={account} />
    }

    else{
      return <MyLikes setLikesCount={setCount} account={account} />
    }
  }



  const followersModal = useDisclosure();

  const followingModal = useDisclosure();

  const format = require("human-readable-numbers");

  const vref = useRef();

  return (
    <VStack
      className="bg-background pb-10"
      overflowX={"hidden"} 
      overflowY={"scroll"}
      width="100%" 
      minHeight={"100vh"}
      direction={"row"}
      padding={10}
    >

     {/* dont forget writeups count near followers */}
      <HStack
        width={"100%"}
      >
        <NavBack />

        <Skeleton 
          isLoaded={!account ? false : true}
        >
          { account &&
            <UserCard 
              avatar_size={"lg"}
              fullName={account.full_name}
              username={account.username}
              avatarUrl={account.avatar}
              verified_size={19}
            />
          }
        </Skeleton>

      </HStack>

    <HStack width={"100%"}>
      <Skeleton isLoaded={!account ? false : true}>
        <Text
          fontFamily={"sans-serif"}
          fontSize={14}
        >
          {account && account.bio}
        </Text>
      </Skeleton>

      <Skeleton isLoaded={!account ? false : true}>
          { account && account.site_link &&

          <HStack>
            <MdLink size={20} color={"lightslategrey"} />
            <Link isExternal href={account.site_link}>
              {account.site_link}
            </Link>
          </HStack>
          }
      </Skeleton>


    </HStack>

     <HStack
      padding={1}
      spacing={5}
      className="flex flex-row self-center w-[90%]"
    >
        
      {/* followers and following */}
      <HStack gap={5}  className="flex flex-row">
        <HStack
          spacing={0}
        >
           <Button
              onPress={followersModal.onOpen}
              size="sm"
              variant="ghost"
              className="w-fit border-0"
            >
             
              <Skeleton isLoaded={followers} className="w-fit">
                <Text
                  className="font-bold"
                  fontSize={16}
                >
                  {followersCount > 0 ? format.toHumanString(followersCount) : "0"}
                </Text>

              </Skeleton>

               <Skeleton isLoaded={followers} className="w-fit">
                <Text
                  fontSize={15}
                  className="text-gray-500"
                >
                  {followersCount !== 1 ? "followers" : "follower"}
                </Text>

              </Skeleton>



          </Button>

        </HStack>


         <HStack
          spacing={0}
        >
           <Button
              onPress={followingModal.onOpen}
              size="sm"
              className="w-fit border-0"
              variant="ghost"
            >
             <Skeleton isLoaded={following}>
                <Text
                  fontSize={16}
                  className="font-bold"
                >
                  {followingCount > 0 ? format.toHumanString(followingCount) : "0"}
                </Text>
            </Skeleton>


             <Skeleton isLoaded={following}>
                 <Text
                  fontSize={15}
                  className="text-gray-500"
                >
                  following
                </Text>
              </Skeleton>


          </Button>

        </HStack>

      </HStack>


      {/* write ups, likes, series */}
      <HStack className="w-full justify-center">
          <Skeleton height={"100%"} width={"100%"} isLoaded={!account ? false : true}>
              { account &&
              <TabBar setCurrent={setCurrent} current={current} count={count} setCount={setCount} />
              }
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
    </HStack>


    {/* Mutuals friends */}
    <Skeleton isLoaded={!account ? false : true} className="w-[95%]">
      {
        account.username ?
      <MutualFriends username={account.username} modal={followersModal} />
        :null
      }
    </Skeleton>


      {/* render current */}
      {renderCurrent()}
 


      {/* followers Modal */}

    <Modal 
      isOpen={followersModal.isOpen}
      onOpenChange={followersModal.onOpenChange}
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
                  Followers
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
                  hasMore={!followersCount===followers.length}
                  width="100%"
                  loadMore={fetchFollowers}
                  data={followers}
                  getScrollParent={()=>vref.current}
                >
                    {
                        followers.map(({follower})=> {
                          return <AccountCard inFeed account={follower} />
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
                        return <AccountCard inFeed account={f.following} />
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
                  isLoading={reportLoading}
                  onClick={()=>handleSubmitReport()}

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
