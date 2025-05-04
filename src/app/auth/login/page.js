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
import { Input, Image, Button } from "@nextui-org/react";
import { setCookie } from "cookies-next";
import { errorToReadable, isAuthenticated } from "@/app/configs/api";




const Login = () => {

  document.title = "Login";

  const { colorMode, toggleColorMode } = useColorMode();


  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [loginError, setLoginError] = useState(false);

  const [show, setShow] = useState(false);

  const [auth_loading, setAuthLoading] = useState(false);

  const [loginBtnDisabled, setLoginBtnDisabled] = useState(false);


  const { auth_login, account } = useContext(AuthContext);


  
  const router = useRouter();


  const toast = useToast();


  const loginUser = async () => {

    setEmailError(null);

    setPasswordError(null);

    setLoginBtnDisabled(true);

    setAuthLoading(true);


    if(!isEmailValid(email))
    {
      setEmailError("Invalid email format.");
    }

    else if(password.length < 6)
    {
      setPasswordError("Password can't be less then six characters long.");
    }

    else{
      const response = await auth_login(email, password);

      if(response && response.status===200)
      {
        setCookie("authTok", JSON.stringify(await response.json()));
         toast({
          title: "Successfully logged-in!",
          status: "success",
          duration: 5000
        })

        return router.replace("/home");
      }
      else{
        setLoginError(await response.json());
      }
      setAuthLoading(false);

    }

    setLoginBtnDisabled(false);
    setAuthLoading(false);
  }



  useEffect(()=> {
    if(loginError)
    {
      if("email" in loginError)
        setEmailError(loginError.email[0]);

      if("password" in loginError)
        setPasswordError(loginError.password[0]);

      if("detail" in loginError)
      {
        toast({
          title: loginError.detail,
          status: "error",
          duration: 4000
        })
      }

      else{
        toast({
          title: "Failed to authenticate.",
          description: errorToReadable(loginError),
          status: "error",
          duration: 4000
        })
      }

    }
  }, [loginError])


  useEffect(()=> {
    if(isAuthenticated())
      return router.replace("/home");
  }, [])

  
  return (
     <div
      style={{overflow: "hidden"}}
      className="bg-background h-[100vh] w-full h-[100h] flex flex-col justify-around p-2 flex-wrap"
    >

    <form
      className="w-full flex flex-row justify-center"
    >
      <VStack
        justifySelf={"center"}
        width={"60%"}
        maxW={"500px"}
      >
        <div className="w-[100vw] flex flex-row justify-end p-10">
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
            isLoaded={!auth_loading}
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
          isLoaded={!auth_loading}
          className="my-10"
          >
            <Image 
              src="/logo.png"
              width={"100px"}
              className="rounded-xl"
            />
        </Skeleton>


        <VStack
          width="80%"
          spacing={"20px"}
        >
           <Skeleton
            width="100%"
            isLoaded={!auth_loading}
            >
            <Input 
              size="lg"
              autoComplete="email"
              label="Email"
              isRequired
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

          <InputGroup>
           <Skeleton
            borderRadius={"3px"}
            isLoaded={!auth_loading}
            width="100%"
          >
            <Input 
              size="lg"
                isRequired
                label="Password"
              fontSize={"large"}
              alignSelf={"center"}
              placeholder="password"
              autoComplete="new-password"
              type={show ?"text" : "password"}
              onChange={(e)=>{
                e.preventDefault();
                setPassword(e.target.value);
              }}
              errorMessage={passwordError}
              isInvalid={passwordError}
            />

            </Skeleton>

             <Skeleton
                borderRadius={"3px"}
                isLoaded={!auth_loading}
              >
                <InputRightElement paddingRight={4} paddingTop={2}>
                  <Touchable type="button" onPress={()=>setShow(!show)}>
                    { show ?
                    <FaEye size={28} />
                      :
                      <FaEyeSlash size={28} />
                    }
                  </Touchable>
                </InputRightElement>
            </Skeleton>
          </InputGroup>



        <Skeleton
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Button
            variant="solid"
            marginTop={5}
            onPress={loginUser}
            isDisabled={!email || !password || loginBtnDisabled}
          >
            Login
          </Button>

        </Skeleton>


      <HStack>
        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Text
          >
            Don't have an account?
          </Text>
        </SkeletonText>


        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Link 
            fontWeight={600}
            color="grey"
            onClick={()=>router.replace("/auth/signup")}
          >
            Signup
          </Link>
        </SkeletonText>

      </HStack>

      <HStack>
        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Text
          >
            Forgot your password?
          </Text>
        </SkeletonText>


        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Link 
            fontWeight={600}
            color="grey"
            onClick={()=>router.replace("/auth/resetPassword")}
          >
            Reset password
          </Link>
        </SkeletonText>

      </HStack>


      </VStack>
    </VStack>
  </form>


  <div className="w-full flex flex-row justify-center py-4">
    <HStack
      direction={"row"}
      width="80%"
      maxWidth={"700px"}
      alignSelf="center"
    >

      <SkeletonText
        borderRadius={"3px"}
        isLoaded={!auth_loading}
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
        isLoaded={!auth_loading}
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
        isLoaded={!auth_loading}
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



export default Login;

