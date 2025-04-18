'use client'
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Avatar, 
  Image, 
  Chip, 
  Button,
  DropdownItem, 
  DropdownMenu, 
  Dropdown, 
  DropdownTrigger,
  Textarea,
  Spinner
} from "@nextui-org/react";
import { 
  Badge, 
  HStack, 
  Text, 
  VStack, 
  Spacer, 
  Show,
  ModalCloseButton,
  ModalOverlay,
  Modal as ChakraModal,
  ModalBody as ChakraModalBody,
  ModalContent as ChakraModalContent,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Slider,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/app/providers/AuthProvider";
import { Flag, MoreHorizontal, Trash } from "@geist-ui/icons";
import { BsDot } from '@react-icons/all-files/bs/BsDot'
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";




export const WriteUpCard = ({writeup, setWriteUps}) => {

  const [reportLoading, setReportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [reportPriority, setReportPriority] = useState(0);
  const [reportDisturbance, setReportDisturbance] = useState(0);

  const { account } = useContext(AuthContext);
  const { 
    submitWriteupReport,
    handleDeleteWriteUp
  } = useContext(LeftFeedContext);



  const toast = useToast();


  const handleDelete = async () => {

    setDeleteLoading(true);


    const response = await handleDeleteWriteUp(writeup.id);

    if(response.status!==200)
    {
      toast({
        title: "Failed to delete the write up!",
        status: "error",
        duration: 3000,
        isClosable: true
      })
    }

    else{
      toast({
        title: "Successfully deleted the write up!",
        status: "success",
        duration: 3000,
        isClosable: true
      });

      setWriteUps(p=>p.filter((i)=> i.id!==writeup.id));
      deleteModal.onClose();
    }

    setDeleteLoading(false);
  }



  const handleSubmitReport = async () => {

    if(!account) return
    
    setReportLoading(true);

    await submitWriteupReport(account.id, writeup.id, reportMessage, reportPriority, reportDisturbance)
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



  const fmt = require("human-readable-numbers");

  const hdate = require("human-date");

  const router = useRouter();


  const reportModal = useDisclosure();
  const deleteModal = useDisclosure();


  return (
    <Card
      itemScope
      itemType="https://schema.org/blogPost"
      className={`w-full max-w-[300px] max-h-[370px] h-full bg-background rounded-md p-0 border-0`}
      isPressable
      onPress={()=>router.push(`/view/writeup/${writeup.id}`)}
      shadow="none"
    >
      <CardHeader
        className="flex flex-col justify-center rounded-xl p-0 border-1"
      >
        <Image
          fetchPriority="low"
          loading="lazy"
          alt="Voidback"
          className="object-fit aspect-[3/2]"
          radius="lg"
          conn
          src={writeup.thumbnail.thumbnail}
          width={300}
          height={200}
        />
      </CardHeader>


      <CardBody className="p-5 flex flex-row">

        <VStack className="w-fit p-2">
          <Avatar itemProp="avatar"  name={writeup.author.full_name[0]} src={writeup.author.avatar} size="md" />
        </VStack>

        <VStack className="h-fit w-full gap-0 flex flex-col" gap={0}>

          <HStack
            className="w-full"
          >
            <Text
              itemProp="title"
              className="text-md text-writeup font-roboto max-w-[100%]"
              textOverflow={"clip"}
              noOfLines={2}
            >
              {writeup.title}
            </Text>

            <Spacer />


          </HStack>


          <HStack className="w-full">
            <Text
              itemProp="full name"
              className="text-xs font-semibold text-gray-500"
            >
              {writeup.author.full_name}
            </Text>
          </HStack>

        </VStack>

      </CardBody>


      <CardFooter
      >
        <HStack className="w-full my-0" gap={0}>
          <Text
            className="text-xs font-semibold text-gray-500"
            itemProp="impressions"
          >
            {fmt.toHumanString(writeup.rank)} {writeup.rank !== 1 ? "Impressions" : "Impression"}
          </Text>

          <BsDot className="text-gray-500" size={20} />

          <Text
            className="text-xs font-semibold text-gray-500"
            itemProp="created_at"
            datetime={writeup.created_at}
          >
            {hdate.relativeTime(writeup.created_at)}
          </Text>

          <Spacer />


          <Dropdown
            showArrow
            radius="sm"
            size="sm"
            itemProp="menu"
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
                <MoreHorizontal className="text-gray-500" />
              </Button>
            </DropdownTrigger>


            <DropdownMenu
            >
              <DropdownItem
                itemProp="report"
                key={"report"}
                startContent={<Flag />}
                className="font-roboto"
                onPress={reportModal.onOpen}
              >
                Report
              </DropdownItem>


              {
                account && account.username===writeup.author.username
                  ?
                 <DropdownItem
                  itemProp="delete"
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
                      Delete This Write Up!
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



        </HStack>
      </CardFooter>
    </Card>
  )
}



