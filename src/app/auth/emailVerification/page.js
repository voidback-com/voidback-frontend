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
  useToast,
  Divider
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

  const [otp, setOtp] = useState("");


  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);


  const { account, auth_verifyOtp, auth_sendOtp } = useContext(AuthContext);


  const router = useRouter();


  const toast = useToast();



  const verify = async () => {

    setLoading(true);

    const response = await auth_verifyOtp(otp);

    const data = await response.json();

    if(response.status===200)
    {
      if(!toast.isActive(101))
        toast({
          title: "Email verification was successful.",
          status: "success",
          duration: 4000,
          id: 101
        });

      setLoading(false);

      return router.push("/home/foryou");
    }
    else{

      if(!toast.isActive(102))
        toast({
          title: "Email verification failed!",
          description: errorToReadable(data),
          status: "error",
          duration: 4000,
          id: 102
        });

    }

    setLoading(false);
  }



  const resend = () => {
    if(account && account.email_verified==true)
    {
      setVerified(true);
    }
    else if(account && !verified){
      setSent(true);
      auth_sendOtp().then(async (res)=> {
        if(res.status==200)
        {
          if(!toast.isActive(103))
            toast({
              title: `successfully sent an otp to ${account.email}`,
              status: "success",
              duration: 4000,
              id: 103
            });
        }
        else{
          if(!toast.isActive(104))
            toast({
              title: `Failed sending an  OTP to ${account.email}`,
              description: errorToReadable(await res.json()),
              status: "error",
              duration: 4000,
              id: 104
            });
        }
      });
    }
    else if(isAuthenticated() && !account || account){
      return router.push("/home/foryou");
    }
    else{
      return router.push("/auth/login");
    }
  }


  useEffect(()=> {
    if(verified)
    {
      return router.push("/home/foryou");
    }
  }, [verified])

  
  return (
     <div
      overflow={"hidden"}
      className="bg-background h-[100vh] w-full flex flex-col justify-around p-2"
    >
      <div className="w-[100vw] flex flex-row justify-end px-10 py-10">
        <Spacer/>
        <Text
          fontSize={"xx-large"}
          fontFamily={"sans-serif"}
          fontWeight={600}
          marginLeft={10}
        >
          Voidback.
        </Text>


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


      <form
        className="w-full flex flex-row justify-center"
      >
        <VStack width={"100%"} height={"100%"} paddingTop={100}>
          <HStack width={"50%"} paddingBottom={4}>
            <Spacer/>

            <Skeleton
             borderRadius={"3px"}
             isLoaded={!loading}
              width="50%"
              maxW={"300px"}
            >
              <Input type="text" placeholder="one time password..." onChange={(e)=>{
                setOtp(e.target.value);
              }}/>
            </Skeleton>


            <Skeleton
               borderRadius={"3px"}
               isLoaded={!loading}
              className="mx-4"
            >
              <Button isDisabled={!otp.length} onClick={verify} size="sm" variant="bordered">
                Verify
              </Button>
            </Skeleton>

            <Divider orientation="vertical" />

            <Skeleton
               borderRadius={"3px"}
               isLoaded={!loading}
              className="mx-4"
            >
              <Button isDisabled={otp.length>0} onClick={resend} size="sm" variant="bordered">
                send an otp
              </Button>
            </Skeleton>


            <Spacer/>
          </HStack>


          <Spacer/>
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
            href="/help/au"
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
            href="/legal/pp"
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
            href="/legal/tos"
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
