'use client'
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { 
  VStack,
  Container,
  HStack,
  useToast,
  Spacer,
  SkeletonText,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Textarea,
  Text,
  IconButton
} from "@chakra-ui/react";
import { SidebarContext } from "@/app/providers/FeedsProvider/SidebarProvider";
import { Button, Skeleton, User, Link, Spinner, useDisclosure } from "@nextui-org/react";
import { GoDotFill } from "react-icons/go";
import { AuthContext } from "@/app/providers/AuthProvider";
import { FaHeart } from "@react-icons/all-files/fa/FaHeart";
import { FaRegHeart } from "@react-icons/all-files/fa/FaRegHeart";
import { IoHeartDislikeSharp } from "@react-icons/all-files/io5/IoHeartDislikeSharp";
import { IoHeartDislikeOutline } from "@react-icons/all-files/io5/IoHeartDislikeOutline";
import { NavBack } from "../components/topSection";
import { Delete } from "@geist-ui/icons";
import { errorToReadable, isAuthenticated } from "@/app/configs/api";
import { FaRegFlag } from "react-icons/fa";
import { useRouter } from "next/navigation";




const PublishedResearchPaper = ({ params }) => {

  const { 
    getPaperById, 
    getResearchImpressions, 
    makeImpression, 
    submitResearchReport,
    getMyResearchImpression,
    deleteResearchPaper
  } = useContext(SidebarContext);
  
  const { account } = useContext(AuthContext);


  const { id } = params;


  const [paper, setPaper] = useState(false);

  const [impressions, setImpressions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [impression, setImpression] = useState(0);

  const [reportDisturbance, setReportDisturbance] = useState(0);
  const [reportPriority, setReportPriority] = useState(0);
  const [reportMessage, setReportMessage] = useState("");


  const toast = useToast();


  const getImpressions = async () => {

    const response = await getResearchImpressions(paper.id);

    const data = await response.json();


    if(response.status===200)
    {
      setImpressions(data);
    }

    if(isAuthenticated())
    {
      const response2 = await getMyResearchImpression(paper.id);

      const data2 = await response2.json();

      if(response2.status===200)
      {
        if(!data2.impression)
        {
         await makeImpression(paper.id, 0);
        }
        else{
          setImpression(data2.impression);
        }
      }
    }
    else{
      setImpression(0);
    }
  }


  const router = useRouter();
  

  const fetchPaper = async () => {

    const response = await getPaperById(id);

    const data = await response.json();

    if(response.status===200)
    {
      if(data?.pdf)
        setPaper(data);
      else{
        toast({
          title: "The research paper was not found.",
          description: "The paper might have been deleted by it's author.",
          status: "warning",
          duration: 4000
        });

        return router.push("/research");
      }
    }
    else{
      alert(JSON.stringify(data));
    }

  }


  useEffect(()=> {
    if(impressions===false && paper)
    {
      getImpressions();
    }
  }, [!impressions, paper, account])




  useEffect(()=> {
    if(!paper)
    {
      fetchPaper();
    }
  }, [!paper])



  const hdate = require("human-date");

  const format = require("human-readable-numbers");


  const reportModal = useDisclosure();
  const deleteModal = useDisclosure();


  const handleSubmitReport = () => {

    submitResearchReport(paper.id, reportMessage, reportPriority, reportDisturbance)
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




  const handleLike = async () => {


    if(!isAuthenticated())
    {
      toast({
        title: "please login to like the research.",
        description: "you are currently unauthenticated!",
        status: "warning",
        duration: 4000
      })
      return;
    }

    setLoading(true);

    let temp = 0;

    if(impression===1)
    {
      setImpression(0);
      temp = 0;
    }
    else{
      setImpression(1);
      temp = 1;
    }
    

    const response = await makeImpression(paper.id, temp);

    const data = await response.json();

    if(response.status!==200){
      toast({
        title: "Error liking the research paper.",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }
    else{
      setImpressions(false);
    }

    setLoading(false);
  }

  
  const handleDislike = async () => {



    if(!isAuthenticated())
    {
      toast({
        title: "please login to dislike the research.",
        description: "you are currently unauthenticated!",
        status: "warning",
        duration: 4000
      })
      return;
    }


    setLoading(true);

    let temp = 0;

    if(impression===-1)
    {
      setImpression(0);
      temp = 0;
    }
    else{
      setImpression(-1);
      temp = -1;
    }
    
    const response = await makeImpression(paper.id, temp);

    const data = await response.json();

    if(response.status!==200){
      toast({
        title: "Error liking the research paper.",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }
    else{
      setImpressions(false);
    }

    setLoading(false);

  }



  const handleDelete = async () => {

    const response = await deleteResearchPaper(paper.id);
    
    const data = await response.json();

    if(response.status!==200)
    {
      toast({
        title: "Failed to delete research paper!",
        description: errorToReadable(data),
        status: "error",
        duration: 3000
      });
    }

    else{
      toast({
        title: "Successfully deleted the research paper!",
        duration: 3000,
        status: "success"
      })
    }
  }




  return (
    <Container minW={"100%"} overflow={"hidden"} height="100vh" className="bg-background">
      {
        paper 

        ?
      <VStack width={"100%"} height={"100%"}>
        <HStack width="100%" padding={10}>
          <HStack width={"100%"}>
            <NavBack />
            <User
              className="mx-5"
              description={(
                <VStack spacing={1} alignItems={"flex-start"}>
                  <Link
                    href={`/view/account/${paper.author.username}`}
                    size="sm"
                    color="foreground"
                  >
                    {paper.author.full_name}
                  </Link>

                  <HStack>
                    <SkeletonText isLoaded={impressions!==false}>
                      <Text
                        color="lightslategrey"
                        fontSize={"small"}
                        fontFamily={"sans-serif"}
                      >
                        {format.toHumanString(impressions.views)} {impressions.views > 1 | impressions.views===0 ? "views" : "view"}
                      </Text>
                    </SkeletonText>

                    <GoDotFill size={5} color="lightslategrey" />

                    
                    <Text
                      color="lightslategrey"
                      fontSize={"small"}
                      textTransform={"lowercase"}
                      fontFamily={"sans-serif"}
                    >
                      {hdate.relativeTime(paper.created_at)}
                    </Text>
                  </HStack>
                </VStack>
              )}
              avatarProps={{
                className: "border-1 rounded-md",
                src: paper.author.avatar,
                size: "md"
              }}
              />



            <Spacer/>

            <HStack padding={0}>
              <Text maxWidth={"600px"} className="line-clamp-2" fontSize={20} fontWeight={800} fontFamily={"gupter"}>
                {paper.title}
            </Text>
            </HStack>
 
            <Spacer/>

            <Skeleton width={"fit-content"} isLoaded={!loading}>
              <HStack gap={0} spacing={1}>

                <Button
                  onClick={handleLike}
                  backgroundColor={"transparent"}
                  variant="light"
                  _hover={{backgroundColor: "transparent", opacity: "70%"}}
                >
                  <HStack>

                    { impression===1 ? <FaHeart size={20} color="tomato" /> : <FaRegHeart size={20} color="tomato" /> }
                    <Text
                      color="lightslategrey"
                      fontWeight={400}
                    >
                      {format.toHumanString(impressions.likes)}
                    </Text>
                  </HStack>
                </Button>


                <Button
                  onClick={handleDislike}
                  _hover={{backgroundColor: "transparent", opacity: "70%"}}
                  backgroundColor={"transparent"}
                  variant="light"
                >
                  <HStack>

                    { impression===-1 ? <IoHeartDislikeSharp size={20} color="tomato" /> : <IoHeartDislikeOutline size={20} color="tomato" /> }

                    <Text
                      color="lightslategrey"
                      fontWeight={400}
                    >
                      {format.toHumanString(impressions.dislikes)}
                    </Text>

                  </HStack>
                </Button>
              </HStack>
            </Skeleton>

            </HStack>


            <Spacer />



            <HStack gap={5} spacing={1}>
              <IconButton isDisabled={!isAuthenticated()} size={"sm"} variant={"light"} onClick={reportModal.onOpen}>
                  <FaRegFlag size={20} />
              </IconButton>


              { account &&
                <IconButton size={"sm"} variant={"light"} onClick={deleteModal.onOpen}>
                    <Delete size={20} color="tomato" />
                </IconButton>
              }
            </HStack>

          </HStack>

       <Modal
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.onClose}
          >
          <ModalOverlay />
            <ModalContent
              width="100%"
              className="bg-background"
              backgroundColor={"default"} 
            >

              <ModalBody
                padding={8}
                height={"100%"}
                backgroundColor={"default"} 
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
                      This action is irreversible, once a research paper is deleted it ceases to exist on the platform.
                    </Text>
                  </VStack>

                  <Spacer/>
                  <Spacer/>

                  <HStack
                    width="60%"
                  >
                    <Button 
                      color="danger"
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

          {/* The body of the research paper (where the pdf is displayed) */}

          <VStack    
            height={"100%"}
              paddingBottom={10}
            width={"100vw"}
          >
            <embed 
              
              style={{
                  width: "80%",
                  borderRadius: 8,
                  height: "100%"
              }} 
              src={paper.pdf}
             type="application/pdf" 
            />

            <Spacer />
              <Spacer />
          </VStack>


        <Modal
          isOpen={reportModal.isOpen}
          onClose={reportModal.onClose}
        >
          <ModalOverlay />

          <ModalContent
            backgroundColor="default"
            width="100%"
            height="80%"
            maxHeight={"600px"}
            className="bg-background"
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
                    Rate the disturbance caused by this research paper
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
                  placeholder="Briefly describe this research paper" 
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



      </VStack>

        :

        <HStack width={"100%"} paddingTop={10}>
          <Spacer />
          <Spinner size="lg" color="default" />
          <Spacer/>
        </HStack>
      }
      
    </Container>
  )
}



export default PublishedResearchPaper;
