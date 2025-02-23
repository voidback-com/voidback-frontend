'use client'
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { 
  VStack,
  HStack,
  Skeleton,
  Text,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { AuthContext } from "../providers/AuthProvider";
import { Input, Link, Button, useDisclosure, Modal, ModalHeader, ModalContent, ModalBody, Avatar, Textarea, Tooltip } from "@nextui-org/react";
import { MdEdit, MdLink } from "react-icons/md";
import { isBioValid, isLinkValid, Touchable } from "../auth/components";
import InfiniteScroll from "react-infinite-scroller";
import { useFileUpload } from "use-file-upload";
import { isFullNameValid, isEmailValid } from "../auth/components";
import { TabBar, UserCard } from "./components/components";
import { errorToReadable, isAuthenticated } from "../configs/api";
import AccountCard from "./components/accountCard";
import { LogOut } from "@geist-ui/icons";
import { useRouter } from "next/navigation";
import { getImageClass } from "../providers/helpers/nsfw";
import { NavBack } from "../globalComponents/buttonFunctions";






const ProfilePage = () => {

  document.title = "Profile";

  const { 

    account, 

    getUsernameFollowers, 
    getUsernameFollowing, 

    getUsernameFollowingCount, 

    updateAccount,
    refreshAccount,

    auth_verifyOtp,
    auth_sendOtp,

    logoutUser

  } = useContext(AuthContext);


  const router = useRouter();


  useEffect(()=> {
    if(!isAuthenticated())
    {
      router.replace("/auth/login");
    }
  }, [])

  const toast = useToast();


  const [followingCount, setFollowingCount] = useState(false);
  const [followersCount, setFollowersCount] = useState(account?.rank);

  const [followers, setFollowers] = useState(false);
  const [following, setFollowing] = useState(false);

  const [newAvatar, selectNewAvatar] = useFileUpload();


  const [newFullName, setNewFullName] = useState(null);
  const [newBio, setNewBio] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newSiteLink, setNewSiteLink] = useState(null);


  const [loading, setLoading] = useState(false);


  const [otp, setOtp] = useState("");



  const handleLogout = () => {
    logoutUser();

    return router.replace("/home");
  }


  const fetchFollowing = async () => {

    if(!following)
    {
      const response = await getUsernameFollowing(account.username, 0, 10);


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
      const response = await getUsernameFollowing(account.username, following.length+1, following.length+10);

      const data = await response.json();

      if(response.status===200)
      {
        setFollowing(p=>[...p, ...data]);
      }
      else{
        setFollowing([]);
      }
    }

    const countResponse = await getUsernameFollowingCount(account.username);

    const countData = await countResponse.json();

    if(countResponse.status===200)
    {
      setFollowingCount(countData.following);
    }

  }



  const fetchFollowers = async () => {

    if(!followers)
    {
      const response = await getUsernameFollowers(account.username, 0, 10);

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
      const response = await getUsernameFollowers(account.username, followers.length+1, followers.length+11);

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



  const otpModal = useDisclosure();


  const saveElement = async (element_data, profileElement, isFile=false) => {

    let dat = new FormData();

    if(!isFile)
      dat.append("data", JSON.stringify(element_data));
    else{
      dat.append(profileElement, element_data);
    }

    const response = await updateAccount(dat);

    const data = await response.json();

    if(response.status===200)
    {
      toast({
        title: `Successfully updated the "${profileElement}".`,
        status: "success",
        duration: 4000
      });

      await refreshAccount();
    }

    else{
      toast({
        title: `Failed to update the "${profileElement}".`,
        status: "error",
        description: errorToReadable(data),
        duration: 4000
      });
    }

  }


  const saveProfile = async () => {
    setLoading(true);


    if(newAvatar)
    {
      const avatarClass = await getImageClass(newAvatar);

      if(avatarClass==="NSFW")
        await saveElement(newAvatar.file, "avatar", true);
      else{
        toast({
          title: "This avatar was classified as not safe for work.",
          description: "Please respect our terms of service.",
          status: "error",
          duration: 3000
        });
      }
    }


    if(newEmail){
      if(isEmailValid(newEmail))
        await saveElement({email: newEmail}, "email");
      else{
        toast({
          title: "Email format error.",
          description: "The email format is invalid please check for typos!",
          status: "error",
          duration: 3000
        });
      }
    }


    if(newFullName){
      const nameValid = await isFullNameValid(newFullName);

      if(nameValid===true) {
        await saveElement({full_name: newFullName}, "full name");
      }

      else if(nameValid==="nsfw"){
        toast({
          title: "Error saving the Full Name.",
          description: "This Full Name is not safe for work, please respect our terms of service!",
          status: "error",
          duration: 3000
        });
      }

      else{
        toast({
          title: "Error saving the Full Name.",
          description: "The Full Name format is invalid please check for typos!",
          status: "error",
          duration: 3000
        });
      }

    }


    if(newBio){
      const bioValid = await isBioValid(newBio);

      if(bioValid===true) {
        await saveElement({bio: newBio}, "bio");
      }

      else if(bioValid==="nsfw")
      {
        toast({
          title: "The new bio contains words that are not safe for work!.",
          description: "Please respect our terms of service.",
          status: "error",
          duration: 3000
        });
      }

      else{
        toast({
          title: "Error saving the new Bio (300 characters exceeded).",
          description: "The new Bio is longer than 300 characters.",
          status: "error",
          duration: 3000
        });
      }
    }


    if(newSiteLink){

      const linkValid = await isLinkValid(newSiteLink);

      if(linkValid===true)
      {
        await saveElement({site_link: newSiteLink}, "site link");
      }

      else if(linkValid === "nsfw")
      {
        toast({
          title: "The new link was classified as not safe for work!",
          description: "Please respect our terms of service.",
          status: "error",
          duration: 3000
        });
      }

      else{
        toast({
          title: "Error saving the new site link.",
          description: "The new site link does not appear to be a valid (http) or (https) link.",
          status: "error",
          duration: 3000
        });
      }
    }


    setLoading(false);

  }


  const checkOTPAndSave = async () => {
    const response = await auth_verifyOtp(otp);

    const data = await response.json();

    if(response.status!==200)
    {
      toast({
        title: `error validating the otp. (check your email: "${newEmail}")`,
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }

    else{
      saveProfile();
    }
    
  }


  const sendOtp = async () => {

    const response = await auth_sendOtp();

    const data = response.json();


    if(response.status!==200)
    {
      toast({
        title: "Error sending a otp.",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }

    else{
      toast({
        title: `Successfully sent an otp to "${account.email}"`,
        status: "success",
        duration: 4000
      })

      otpModal.onOpen();
    }
  }

  const followersModal = useDisclosure();

  const followingModal = useDisclosure();

  const editModal = useDisclosure();


  const format = require("human-readable-numbers");
  const vref = useRef();


  return (
   <VStack
      background={"default"} 
      className="bg-background"
      overflowX={"hidden"} 
      overflowY={"hidden"}
      width="100%" 
      maxHeight={"100vh"}
      height={"100vh"}
      direction={"row"}
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
            <UserCard 
              avatar_size={"lg"}
              fullName={account.full_name}
              username={account.username}
              avatarUrl={account.avatar}
              verified_size={19}
            />
          }
        </Skeleton>


        <Skeleton isLoaded={!account ? false : true}>
          <Button variant="bordered" onPress={editModal.onOpen} className="mx-10" size="sm" endContent={<MdEdit size={20} />}>
            edit profile
          </Button>
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
      width={"100%"}
    >
      <HStack
        spacing={0}
      >
        <Skeleton isLoaded={followers}>
            <Text
              fontSize={"small"}
              fontWeight={900}
            >
              {followersCount > 0 ? format.toHumanString(followersCount) : "0"}
            </Text>
        </Skeleton>

        <Touchable
            onPress={followersModal.onOpen}
            size="sm"
            variant="light"
          >
          <Skeleton isLoaded={followers} className="w-fit">
              <Text
                fontSize={"small"}
                color={"lightslategrey"}
                fontFamily={"sans-serif"}
                fontWeight={600}
              >
                Followers
              </Text>
          </Skeleton>
        </Touchable>

      </HStack>


       <HStack
        spacing={0}
      >
        <Skeleton isLoaded={following}>
            <Text
              fontSize={"small"}
              fontWeight={900}
            >
              {followingCount > 0 ? format.toHumanString(followingCount) : "0"}
            </Text>
        </Skeleton>

        <Skeleton isLoaded={following}>
          <Touchable
            onPress={followingModal.onOpen}
            size="sm"
            variant="light"
            className="w-fit"
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
            content="Logout"
          >
            <Button
              size="sm"
              variant="light"
              color="danger"
              onPress={handleLogout}
            >
              <LogOut />
            </Button>
          </Tooltip>
        </Skeleton>

    </HStack>


    {/* posts, research, likes */}
    <Skeleton height={"100%"} width={"100%"} isLoaded={!account ? false : true}>
        { account &&
        <TabBar account={account} />
        }
    </Skeleton>


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



    {/* Edit Modal */}

    <Modal 
      isOpen={editModal.isOpen}
      onOpenChange={editModal.onOpenChange}
    >

      <ModalContent
        className="h-fit w-1/2 p-2 bg-background border-1"
      >

        {(onClose)=> (
            <>

              <ModalHeader>
                <Text
                  fontSize={"medium"}
                  fontFamily={"sans-serif"}
                  fontWeight={600}
                >
                  Edit Profile
                </Text>
              </ModalHeader>

              <ModalBody
                height={"100%"}
              >
                <VStack
                  width="100%"
                  height="100%"
                  alignItems={"center"}
                  spacing={8}
                >
                  <Skeleton
                    isLoaded={!loading}
                  >
                    <Touchable onPress={()=>selectNewAvatar({"multiple": false, "accept": true})}>
                      <Avatar 
                        className="border-1"
                        src={newAvatar ? newAvatar.source : account.avatar} 
                        size="lg"
                        radius="md"
                      />
                    </Touchable>
                  </Skeleton>

                  <div className="w-full h-fit gap-2 flex flex-col">

                  <Skeleton
                    width="100%"
                    isLoaded={!loading}
                  >
                    <Input 
                      label="username" 
                      placeholder="username" 
                      defaultValue={account.username} 
                      isDisabled
                    /> 
                  </Skeleton>

                  <Skeleton
                    isLoaded={!loading}
                  >
                    <div className="w-full h-fit flex flex-row px-2 gap-4">
                      <p className="py-1 text-xs text-slate-500">
                      username cannot be changed on this platform.
                      </p>
                    </div>
                  </Skeleton>
                  </div>


                  <Skeleton
                    width={"100%"}
                    isLoaded={!loading}
                  >
                  <Input label="Full Name" placeholder="full name" defaultValue={account.full_name} onChange={(e)=> {
                    setNewFullName(e.target.value);
                  }} /> 

                  </Skeleton>


                  <Skeleton
                    width={"100%"}
                    isLoaded={!loading}
                  >
                    <Textarea 
                      label="bio" 
                      placeholder="bio" 
                      defaultValue={account.bio}
                      onChange={(e)=> {
                        setNewBio(e.target.value);
                      }}
                    />
                  </Skeleton>


                  <Skeleton
                    width={"100%"}
                    isLoaded={!loading}
                  >
                    <Input onChange={(e)=> {
                      setNewEmail(e.target.value);
                    }} label="email" placeholder="email" defaultValue={account.email} /> 
                  </Skeleton>


                  <Skeleton
                    width={"100%"}
                    isLoaded={!loading}
                  >
                    <Input onChange={(e)=> {
                      setNewSiteLink(e.target.value);
                    }} label="site link" placeholder="site link" defaultValue={account.site_link} /> 
                  </Skeleton>


                  <Skeleton
                    isLoaded={!loading}
                  >
                    <Button
                      onPress={()=> {
                        if(newEmail)
                        {
                          sendOtp();
                        }
                        else{
                          saveProfile();
                        }
                      }}
                    >
                      save
                    </Button>
                  </Skeleton>
                </VStack>
              </ModalBody>
            </>
          )}
      </ModalContent>
    </Modal>


    <Modal 
      isOpen={otpModal.isOpen}
      onOpenChange={otpModal.onOpenChange}
    >

      <ModalContent
        className="h-fit w-1/2 p-2"
      >

        {(onClose)=> (
            <>

              <ModalHeader>
                <Text
                  fontSize={"medium"}
                  fontFamily={"sans-serif"}
                  fontWeight={600}
                >
                  OTP Verification
                </Text>
              </ModalHeader>

              <ModalBody
                height={"100%"}
              >
                <VStack
                  width="100%"
                  height="100%"
                  alignItems={"center"}
                  spacing={10}
                >

                  <Input label="One Time Password" placeholder={`the otp sent to ${account.email}`} onChange={(e)=>{
                    setOtp(e.target.value);
                  }} /> 


                  <HStack spacing={4} width={"fit-content"} padding={2}>
                    <Button
                      onPress={checkOTPAndSave}
                    >
                      verify
                    </Button>

                    <Button
                      onPress={sendOtp}
                    >
                      resend
                    </Button>
                  </HStack>


                </VStack>
              </ModalBody>
            </>
          )}
      </ModalContent>
    </Modal>


  </VStack>

  )
}



export default ProfilePage;
