'use client'
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { 
  VStack,
  Wrap,
  WrapItem,
  Spacer,
  HStack,
  Text,
  useToast
} from "@chakra-ui/react";
import { LeftSection } from "../home/components/Sections";
import { Accordion, AccordionItem, Button, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from "@nextui-org/react";
import { AuthContext } from "../providers/AuthProvider";
import { FaEyeSlash } from "@react-icons/all-files/fa/FaEyeSlash";
import { FaEye } from "@react-icons/all-files/fa/FaEye";
import { Touchable } from "../auth/components";
import { InputGroup, InputRightElement } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { errorToReadable, isAuthenticated } from "../configs/api";
import { Popover } from "@mui/material";


export const metdata = {
  title: "Settings",
  description: "Voidback's settings page.",
  referrer: "origin-when-cross-origin",
  keywords: ["finance", "quant", "voidback", "social media", "platform", "voidback login", "fintech", "data-hub", "data broker", "financial data", "realtime data", "stocks", "options", "stock market", "investments", "models", "quantitative analysis"]
}





const SettingsPage = () => {



  const { 
    account,
    deleteAccount,
    auth_sendOtp,
    auth_verifyOtp,
    updateAccount,
    logoutUser
  } = useContext(AuthContext);


  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [show, setShow] = useState(false);


  const toast = useToast();

  const passwordResetModal = useDisclosure();

  const deleteAccountModal = useDisclosure();



  const sendOTP = async (modal) => {

    const response = await auth_sendOtp();

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
        description: account.email,
        status: "success",
        duration: 4000,

      }); 

      modal.onOpen();
    }
  }



  const handleReset = async () => {

    const response = await auth_verifyOtp(otp);

    const data = await response.json();

    if(response.status===200)
    {
      toast({
        "title": "OTP verified.",
        description: data.message,
        duration: 4000,
        status: "success"
      })

      let frm = new FormData();

      frm.append("data", JSON.stringify({password: newPassword}));

      const response1 = await updateAccount(frm);

      const data1 = await response1.json();

      if(response1.status===200)
      {
         toast({
          "title": "Password changed successfully.",
          duration: 4000,
          status: "success"
        });

        passwordResetModal.onClose();
      }

      else{
       toast({
          "title": "Error changing the password.",
          description: errorToReadable(data1),
          duration: 4000,
          status: "error"
        });
      }
    }

    else{
      toast({
        "title": "OTP is invalid!",
        description: data.error,
        duration: 4000,
        status: "error"
      })
    }
  }


  const router = useRouter();

  const handleDeleteAccount = async () => {

    const response = await deleteAccount(otp);

    if(response.status===200)
    {
       toast({
        "title": "Account deleted successfully!",
        duration: 4000,
        status: "success"
      });

      logoutUser();
      deleteAccountModal.onClose();
      router.replace("/home");
    }

    else if(response.status===404)
    {
      toast({
        "title": "OTP is invalid!",
        description: "the otp is either expired or invalid.",
        duration: 4000,
        status: "error"
      })
    }

    else{
       toast({
        "title": "Failed to delete account!",
        description: "Unknown error occurred while trying to delete this account, please try again.",
        duration: 4000,
        status: "error"
      });
    }

  }


  return (
    <HStack
      className="w-[100vw] h-[100vh] bg-background"
      overflowX={"hidden"}
      overflowY={"hidden"}
    >
      <LeftSection currentSelection={"/settings"} />

      <Spacer/>

      <VStack 
        height={"100%"} 
        width={"50vw"} 
      >
        <Spacer/>
        <Accordion className="w-1/2 min-w-fit" variant="bordered">

          <AccordionItem className="h-fit" isDisabled={!isAuthenticated()} key="Change password" aria-label="change password" title="Change password">
            <HStack>
              <Spacer/>
              <Button onPress={()=>sendOTP(passwordResetModal)} variant="bordered">
                change your password
              </Button>
              <Spacer/>
            </HStack>
          </AccordionItem>

          <AccordionItem isDisabled={!isAuthenticated()} className="h-fit" key="Delete account" aria-label="delete account" title="Delete account">
            <HStack>
              <Spacer/>

              <Button onPress={()=>sendOTP(deleteAccountModal)} color="danger" variant="bordered">
                Delete Account
              </Button>
              <Spacer/>
            </HStack>
          </AccordionItem>


          <AccordionItem className="h-fit" key="Legal" aria-label="legal" title="Legal">
            <HStack padding={5}>
              <Spacer/>
              <Link href="/legal/pp" color="foreground" underline="always">
                Privacy Policy
              </Link>

              <Spacer/>
              <Link href="/legal/tos" color="foreground" underline="always">
                Terms Of Service
              </Link>
              <Spacer/>
            </HStack>
          </AccordionItem>

          <AccordionItem className="h-fit" key="Help" aria-label="Help" title="Help">
            <HStack padding={5}>

              <Spacer/>

              <Link href="/help/au" color="foreground" underline="always">
                About us
              </Link>

              <Spacer/>

              <Link href="mailto: support@voidback.com" type="email" color="foreground" underline="always">
                Contact us
              </Link>

              <Spacer/>
 
            </HStack>
          </AccordionItem>
        </Accordion>

        <Spacer />
        <Spacer />


        <Modal
          isOpen={passwordResetModal.isOpen}
          onOpenChange={passwordResetModal.onOpenChange}
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
                        setNewPassword(e.target.value);
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
                  update
                </Button>
                  <Spacer/>
              </VStack>
            </ModalBody>
            )}
          </ModalContent>

        </Modal>



        <Modal
          isOpen={deleteAccountModal.isOpen}
          onOpenChange={deleteAccountModal.onOpenChange}
          scrollBehavior="normal"
          className="bg-background border-1"
          placement="center"
        >
          <ModalContent className="w-full h-1/2 p-4">

            {(onClose)=> (
            <ModalBody>
              <VStack width={"100%"} height={"100%"} paddingTop={100}>
                <Text
                  fontWeight={"semibold"}
                >
                  Are you sure?
                </Text>

                  <HStack paddingBottom={5}>
                    <Text
                      color={"lightslategrey"}
                      fontFamily={"sans-serif"}
                      fontSize={"small"}
                    >
                      This action is irreversible, once your account is deleted, your data (posts, research, everything associated with your account) will cease to exist on the platform.
                    </Text>
                </HStack>


                <HStack width={"100%"} paddingBottom={4}>
                  <Spacer/>
                  <Input type="text" placeholder="one time password..." onChange={(e)=>{
                    setOtp(e.target.value);
                  }}/>
                </HStack>


                <Button  color="danger" onClick={handleDeleteAccount}>
                    delete anyway
                </Button>
                <Spacer/>
              </VStack>
            </ModalBody>
            )}
          </ModalContent>

        </Modal>



      </VStack>

      <Spacer/>
      <Spacer/>
   </HStack>
  )

}



export default SettingsPage;
