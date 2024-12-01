"use client"
import { 
  VStack,
  useColorMode,
  Spacer,
  HStack,
  Text,
  Link,
  IconButton,
  useDisclosure,
  InputGroup,
  InputRightElement,
  Skeleton,
  SkeletonText,
  useToast
} from "@chakra-ui/react";
import { FaMoon } from "@react-icons/all-files/fa/FaMoon";
import { HiSun } from "@react-icons/all-files/hi/HiSun";
import { useState, useEffect } from "react"; 
import { FaEye } from "@react-icons/all-files/fa/FaEye";
import { FaEyeSlash } from "@react-icons/all-files/fa/FaEyeSlash";
import { Touchable, isEmailValid } from "../components/index";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/providers/AuthProvider";
import { Input, Image, Button, Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/react";
import { setCookie } from "cookies-next";
import { API_URL, errorToReadable, isAuthenticated } from "@/app/configs/api";







const Page = () => {


  const { colorMode, toggleColorMode } = useColorMode();


  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [otp, setOtp] = useState("");



  const [show, setShow] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);


  const { auth_reset, auth_sendOtp } = useContext(AuthContext);


  
  const router = useRouter();


  const toast = useToast();


  useEffect(()=> {
    if(isAuthenticated())
      return router.push("/home");
  }, [])


  const passwordModal = useDisclosure();


  const verifyEmail = async () => {
    const response = await fetch(API_URL+`account/anonymous_sendOtp?email=${email}`, {method: "GET"});
    
    const data = await response.json();

    if(response.status!==200)
    {
      toast({
        title: "Failed to send a One-Time-Password.",
        description: data.error,
        status: "error",
        duration: 4000
      })
    }

    else{

     toast({
        title: "Check your email inbox for a One-Time-Password.",
        description: email,
        status: "success",
        duration: 4000,

      }); 

      passwordModal.onOpen();
    }

  }


  const handleReset = async () => {

    setLoading(true);

    const response = await auth_reset({"otp": otp, "password": password, "email": email});

    const data = await response.json();

    if(response.status===200)
    {
      toast({
        title: "Password was successfully updated!",
        description: "you can login now with your new password.",
        status: "success",
        duration: 4000
      })

      passwordModal.onClose();
    }
    else{
      toast({
        title: "Password reset failed!",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })

    }

    setLoading(false);
  }

  
  return (
     <div
      overflow={"hidden"}
      className="bg-background h-[100vh] w-full flex flex-col justify-around p-2"
    >

    <form
      className="w-full flex flex-row justify-center"
    >
      <VStack
        justifySelf={"center"}
        width={"60%"}
        maxW={"500px"}
      >
        <div className="w-[100vw] flex flex-row justify-end px-10 py-10">
            <Spacer />
          <Skeleton
            borderRadius={"3px"}
            isLoaded={!loading}
          >
            <IconButton
              onClick={toggleColorMode}
              variant={"unstyled"}
            >
              { colorMode==="light"
                ?
                <FaMoon size={30} />
                :
                <HiSun size={30} color="white" />
              }
            </IconButton>
          </Skeleton>
        </div>


         <Skeleton
          borderRadius={"3px"}
          isLoaded={!loading}
          className="my-10"
          >
            <Image 
              src="/logo.png"
              width={"200px"}
            />
        </Skeleton>


        <VStack
          width="80%"
          spacing={"20px"}
        >
           <Skeleton
            width="100%"
            borderRadius={"3px"}
            isLoaded={!loading}
            >
            <Input 
              size="lg"
              autoComplete="email"
              placeholder="email"
              type="email"
              onChange={(e)=>{
                e.preventDefault();
                setEmail(e.target.value);
              }}
              errorMessage={emailError}
              isInvalid={emailError}
            />
          </Skeleton>

          <Spacer/>


        <Skeleton
          borderRadius={"3px"}
          isLoaded={!loading}
        >
          <Button
            marginTop={5}
            variant={"solid"}
            onClick={verifyEmail}
          >
            verify
          </Button>

        </Skeleton>


      <HStack marginTop={5}>
        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!loading}
        >
          <Link 
            fontWeight={600}
            color="grey"
            onClick={()=>router.push("/auth/login")}
          >
            Login
          </Link>
        </SkeletonText>

        <Text>
          OR
        </Text>

        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!loading}
        >
          <Link 
            fontWeight={600}
            color="grey"
            onClick={()=>router.push("/auth/signup")}
          >
            Signup
          </Link>
        </SkeletonText>
      </HStack>



      {/* password reset modal */}
      <Modal
        isOpen={passwordModal.isOpen}
        onOpenChange={passwordModal.onOpenChange}
        scrollBehavior="normal"
        placement="center"
      >
        <ModalContent className="w-full h-1/2 p-4 bg-background border-1">

          {(onClose)=> (
          <ModalBody
              className="w-full h-full bg-background"
            >
            <VStack width={"100%"} height={"100%"} paddingTop={100}>
              <HStack width={"100%"} paddingBottom={4}>
                <Spacer/>
                <Input type="text" placeholder="one time password..." onChange={(e)=>{
                  setOtp(e.target.value);
                }}/>
              </HStack>

              <HStack width={"100%"} paddingBottom={5}>
                <InputGroup>
                   <Input 
                    size="md"
                    fontSize={"large"}
                    alignSelf={"center"}
                    placeholder="new password here..."
                    type={show ?"text" : "password"}
                    onChange={(e)=>{
                      setPassword(e.target.value);
                    }}
                  />
                 <InputRightElement paddingRight={4}>
                    <Touchable onClick={()=>setShow(!show)}>
                      { show ?
                      <FaEye size={28} />
                        :
                        <FaEyeSlash size={28} />
                      }
                    </Touchable>
                  </InputRightElement>
                </InputGroup>
              </HStack>

              <Button onClick={handleReset} variant="bordered">
                reset
              </Button>
                <Spacer/>
            </VStack>
          </ModalBody>
          )}
        </ModalContent>

      </Modal>



      </VStack>
    </VStack>
  </form>

  <Spacer />

  <div className="w-full flex flex-row justify-center py-4">
      <HStack
        direction={"row"}
        width="80%"
        maxWidth={"700px"}
        alignSelf="center"
      >

        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!loading}
        >         
          <Link
            color="grey"
            fontSize={"small"}
            fontWeight={500}
          >
            About
          </Link>

        </SkeletonText>

        <Spacer/>

        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!loading}
        >
          <Link
            color="grey"
            fontSize={"small"}
            fontWeight={500}
          >
            Cookies Policy
          </Link>

        </SkeletonText>


        <Spacer/>

        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!loading}
        >
          <Link
            color="grey"
            fontSize={"small"}
            fontWeight={500}
          >
            Privacy Policy
          </Link>

        </SkeletonText>

        <Spacer/>

        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!loading}
        >
          <Link
            color="grey"
            fontSize={"small"}
            fontWeight={500}
          >
            Terms Of Service
          </Link>

        </SkeletonText>
      </HStack>
    </div>
  </div>
  )
}



export default Page;
