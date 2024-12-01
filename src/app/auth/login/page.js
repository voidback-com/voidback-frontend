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
import { isAuthenticated } from "@/app/configs/api";





const Login = () => {


  const { colorMode, toggleColorMode } = useColorMode();


  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const [show, setShow] = useState(false);
  const [auth_loading, setAuthLoading] = useState(false);

  const { auth_login } = useContext(AuthContext);


  
  const router = useRouter();


  const toast = useToast();


  const loginUser = () => {
    setEmailError(null);
    setPasswordError(null);

    if(!isEmailValid(email))
    {
      setEmailError("Invalid email format.");
    }

    else if(password.length < 6)
    {
      setPasswordError("Password can't be less then six characters long.");
    }

    else{
      auth_login(email, password)
        .then(async (res)=> {
           if(res.status===200)
            {
              setLoginSuccess(true);
              setCookie("authTok", JSON.stringify(await res.json()));
            }
            else{
              setLoginError(await res.json());
            }
            setAuthLoading(false);
        })

      if(loginSuccess)
      {
        toast({
          title: "Successfully logged-in!",
          status: "success",
          duration: 5000
        })

        return router.push("/home");
      }
    }
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

    }
  }, [loginError])


  useEffect(()=> {
    if(isAuthenticated())
      return router.push("/home");
  }, [])

  
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
            isLoaded={!auth_loading}
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

          <InputGroup>
           <Skeleton
            borderRadius={"3px"}
            isLoaded={!auth_loading}
            width="100%"
          >
            <Input 
              size="lg"
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

            <InputRightElement paddingRight={4} paddingTop={2}>
              <Touchable type="button" onClick={()=>setShow(!show)}>
                { show ?
                <FaEye size={28} />
                  :
                  <FaEyeSlash size={28} />
                }
              </Touchable>
            </InputRightElement>
          </InputGroup>



        <Skeleton
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Button
            variant="solid"
            marginTop={5}
            onClick={loginUser}
            isDisabled={!email || !password}
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
            onClick={()=>router.push("/auth/signup")}
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
            onClick={()=>router.push("/auth/resetPassword")}
          >
            Reset password
          </Link>
        </SkeletonText>

      </HStack>


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
          isLoaded={!auth_loading}
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
          isLoaded={!auth_loading}
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
          isLoaded={!auth_loading}
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
          isLoaded={!auth_loading}
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



export default Login;

