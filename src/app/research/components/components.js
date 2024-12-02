'use client'
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { 
  HStack,
  VStack,
  Spacer,
  Text,
  SkeletonText,
  IconButton,
  ModalBody,
  Modal,
  ModalContent,
  ModalOverlay,
  useToast,
  WrapItem,
  Wrap,
} from "@chakra-ui/react";
import { Card, CardHeader, User, Link, CardBody, Image, CardFooter, Button, Skeleton, Divider, Pagination, useDisclosure, Spinner } from "@nextui-org/react";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { SidebarContext } from "@/app/providers/FeedsProvider/SidebarProvider";
import { useRouter } from "next/navigation";
import { FaEye, FaTrash } from "react-icons/fa";
import { AuthContext } from "@/app/providers/AuthProvider";
import InfiniteScroll from "react-infinite-scroller";
import { UserCard } from "@/app/profile/components/components";
import { errorToReadable, isAuthenticated } from "@/app/configs/api";
import { Delete, Eye } from "@geist-ui/icons";




export const ResearchPaperCard = ({paper, deletable=false}) => {


  const { 
    getResearchImpressions,
    deleteResearchPaper
 } = useContext(SidebarContext);


  const { account } = useContext(AuthContext);


  const [impressions, setImpressions] = useState(false);


  const getImpressions = async () => {

    const response = await getResearchImpressions(paper.id);

    const data = await response.json();

    if(response.status===200)
    {
      setImpressions(data);
    }
    else{
      toast({
        title: "Error fetching research paper impressions.",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
      setImpressions({views: 0, likes: 0, dislikes: 0});
    }
  }


  useEffect(()=> {
    if(impressions===false && paper)
    {
      getImpressions();

    }
  }, [account, !impressions, paper])



  const hdate = require("human-date");



  const format = require("human-readable-numbers");


  const router = useRouter();

  const toast = useToast();


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


  const deleteModal = useDisclosure();

  return (
    <VStack className="bg-background">
      <Card
        className={`w-fit h-[370px] shadow-none border-0 ${deletable && "h-[400px]"} bg-background gap-0`} 
        isPressable={!deletable}
        onPress={()=>router.push(`/research/${paper.id}`)}
      >

        <CardHeader className={`w-full`}>
          {deletable && 
            <IconButton variant={"light"} size={"sm"} onClick={()=>router.push(`/research/${paper.id}`)}>
              <Eye size={20} />
            </IconButton>
          }
            { deletable &&
              <HStack width={"100%"}>
                <Spacer />

                  <IconButton variant={"light"} size={"sm"} onClick={deleteModal.onOpen}>
                    <Delete size={20} color="tomato" />
                  </IconButton>
              </HStack>
            }
          <Modal
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.onClose}
          >
          <ModalOverlay />
            <ModalContent
              width="100%"
              backgroundColor={"default"}
              className="bg-background"
            >

              <ModalBody
                padding={8}
                height={"100%"}
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
                      This action is irreversible, once a post is deleted it ceases to exist on the platform.
                    </Text>
                  </VStack>

                  <Spacer/>
                  <Spacer/>

                  <HStack
                    width="60%"
                  >
                    <Button 
                      color={"danger"}
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
        </CardHeader>



        <CardBody className="border-0 p-0 max-h-[201px] max-w-[301px]">
            <Image
              className={`object-fill w-[300px] h-[200px] border-3 border-white`}
              itemScope
              src={paper.thumbnail}
            />
        </CardBody>


        <CardFooter  className="flex flex-col gap-4 px-3">
          <Text marginLeft={1} maxWidth={"250px"} className="line-clamp-2" fontSize={15} fontWeight={800} fontFamily={"gupter"} paddingBottom={1}>
              {paper.title}
          </Text>
 
          <HStack width="100%">
            <User
              className="max-w-[300px] gap-2"
              name={paper.author.full_name}
              description={(
                <Text color="lightslategrey" fontWeight={400} size="sm">
                  @{paper.author.username}
                </Text>
              )}
              avatarProps={{
                src: paper.author.avatar,
                className: "rounded-full border-slate-100 border-1",
                size: "md"
              }}
              
            />

            <Spacer />

            <VStack>
              <SkeletonText isLoaded={impressions!==false}>
                <Text
                  color="lightslategrey"
                  fontSize={12}
                  fontFamily={"sans-serif"}
                >
                  {format.toHumanString(impressions.views)} {impressions.views > 1 | impressions.views===0 ? "views" : "view"}
                </Text>
              </SkeletonText>

                
              <Text
                color="lightslategrey"
                fontSize={12}
                textTransform={"lowercase"}
                fontFamily={"sans-serif"}
              >
                {hdate.relativeTime(paper.created_at)}
              </Text>
            </VStack>
          </HStack>
        </CardFooter>
      </Card>
    </VStack>
  )

}




export const RenderMyResearch = () => {

  const { myResearch } = useContext(SidebarContext);

  const [papers, setPapers] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [loading, setLoading] = useState(false);


  const toast = useToast();


  const fetchPapers = async () => {
    if(loading) return;

    setLoading(true);
    if(!papers)
    {
      const response = await myResearch(0, 10);

      const data = await response.json();

      if(response.status===200)
      {
        if(data && data.length)
          setPapers(data);
        else
          setEndReached(true);
      }
      else{
        toast({
          title: "Error fetching research papers.",
          description: errorToReadable(data),
          status: "error",
          duration: 4000
        })
      }
    }
    else{
      const response = await myResearch(papers.length+1, papers.length+11);

      const data = await response.json();

      if(response.status===200)
      {
        if(data && data.length)
          setPapers(p=>[...p, ...data]);
        else{
          setEndReached(true);
        }
      }
      else{
        toast({
          title: "Error fetching research papers.",
          description: errorToReadable(data),
          status: "error",
          duration: 4000
        })
      }
    }

    setLoading(false);
  }


  const renderItems = () => {
    if(papers && papers.length)
      return papers.map((paper)=> {
        return <ResearchPaperCard paper={paper} deletable={true} />
      })
  }


  useEffect(()=> {
    if(!papers && isAuthenticated())
    {
      fetchPapers();
    }
  }, [!papers])


  const vref = useRef();


  return (
    <VStack
      height={"100%"}
      ref={vref}
      overflowY={"auto"}
      paddingBottom={"22%"}
      style={{scrollbarWidth: "none"}}
      paddingTop={10}
      >

      {!papers?.length && isAuthenticated() && !loading ? <Text fontSize={"small"}>no published research found.</Text> : null}

      {!isAuthenticated() ? <Text fontSize={"small"}>Can't load research, you are not authenticated.</Text> : null}


       <InfiniteScroll
        pageStart={0}
        style={{paddingBottom: 100}}
        hasMore={!endReached}
        width="100%"
        loadMore={fetchPapers}
        data={papers}
        getScrollParent={()=>vref.current}
        threshold={1000}
        loader={
          <HStack
            width="100%"
          >
            <Spacer/>
            <Spinner size="md" color="default" />
            <Spacer/>
          </HStack>
        }
      >
        {renderItems()}
      </InfiniteScroll>
    </VStack>
  )


}




export const RenderAccountResearch = ({username}) => {

  const { accountResearch } = useContext(SidebarContext);

  const [papers, setPapers] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [loading, setLoading] = useState(false);


  const toast = useToast();


  const fetchPapers = async () => {
    if(loading) return;

    setLoading(true);
    if(!papers)
    {
      const response = await accountResearch(username, 0, 10);

      const data = await response.json();

      if(response.status===200)
      {
        if(data && data.length)
          setPapers(data);
        else
          setEndReached(true);
      }
      else{
        toast({
          title: "Error fetching research papers.",
          description: errorToReadable(data),
          status: "error",
          duration: 4000
        })
      }
    }
    else{

      const response = await accountResearch(username, papers.length+1, papers.length+11);

      const data = await response.json();

      if(response.status===200)
      {
        if(data && data.length)
          setPapers(p=>[...p, ...data]);
        else{
          setEndReached(true);
        }
      }
      else{
        toast({
          title: "Error fetching research papers.",
          description: errorToReadable(data),
          status: "error",
          duration: 4000
        })
      }
    }


    setLoading(false);
  }


  const renderItems = () => {
    if(papers && papers.length)
      return papers.map((paper)=> {
        return <ResearchPaperCard paper={paper} deletable={false} />
      })
  }


  useEffect(()=> {
    if(!papers && isAuthenticated())
    {
      fetchPapers();
    }
  }, [!papers])


  const vref = useRef();


  return (
    <VStack
      height={"100%"}
      ref={vref}
      overflowY={"auto"}
      paddingBottom={"22%"}
      style={{scrollbarWidth: "none"}}
      paddingTop={10}
      >

      {!papers?.length && isAuthenticated() && !loading ? <Text fontSize={"small"}>no published research found.</Text> : null}



       <InfiniteScroll
        pageStart={0}
        style={{paddingBottom: 100}}
        hasMore={!endReached}
        width="100%"
        loadMore={fetchPapers}
        data={papers}
        getScrollParent={()=>vref.current}
        threshold={1000}
        loader={
          <HStack
            width="100%"
          >
            <Spacer/>
            <Spinner size="md" color="default" />
            <Spacer/>
          </HStack>
        }
      >
        {renderItems()}
      </InfiniteScroll>


    </VStack>
  )

}


