'use client'
import { 
  useRef,
  useContext,
  useState
} from "react";
import { 
  VStack,
  Text,
  useToast,
  Modal as ChakraModal,
  ModalBody as ChakraModalBody,
  ModalContent as ChakraModalContent,
  useDisclosure as useChakraDisclosure,
  ModalOverlay,
  ModalCloseButton,
  HStack,
  Spacer
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import InfiniteScroll from "react-infinite-scroller";
import { WriteUpCard } from "@/app/home/components/WriteUpCard";
import { Spinner, Skeleton, Chip, Button } from "@nextui-org/react";
import { AuthContext } from "@/app/providers/AuthProvider";
import { Trash } from "@geist-ui/icons";




const ViewSeries = ({ params }) => {

  const p = params;

  const name = decodeURI(p.name);

  document.title = name;


  const { 
    getSeriesWriteups,
    deleteSeries,
  } = useContext(LeftFeedContext);

  const { account } = useContext(AuthContext);


  const [writeups, setWriteups] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [writeUpsCount, setWriteUpsCount] = useState(0);
  const [created_at, setCreatedAt] = useState(false);
  const [sid, setSid] = useState(null);
  const [author, setAuthor] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);


  const deleteModal = useChakraDisclosure();

  const toast = useToast();


  const handleDelete = async () => {
    if(!sid) return;

    setDeleteLoading(true);


    const response = await deleteSeries(sid);

    if(response.status!==200)
    {
      toast({
        title: "Failed to delete series!",
        status: "error",
        duration: 3000,
        isClosable: true
      })
    }

    else{
      toast({
        title: "Successfully deleted the series!",
        status: "success",
        duration: 3000,
        isClosable: true
      });

      deleteModal.onClose();
    }

    setDeleteLoading(false);
  }




  const fetchWriteUps = async () => {

    if(loading || endReached) return;

    setLoading(true);

    const response = await getSeriesWriteups(name, page);

    const data = await response.json();

    if(response.status===200)
    {
      if(page>1)
        setWriteups(p=>[...p, ...data.results]);
      else
      {
        setWriteups(data.results);
        if(data.results.length)
        {
          setAuthor(data.results[0].author);
          setCreatedAt(data.results[0].series.created_at);
          setSid(data.results[0].series.id);
        }
      }

      setWriteUpsCount(data.count);

      if(data.next)
        setPage(page+1);
      else
        setEndReached(true);

    }
    else{
      return toast({
        title: "failed to fetch write ups!",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }

    setLoading(false);
  }


  const router = useRouter();

  const format = require("human-readable-numbers");
  const hdate = require("human-date");

  const vref = useRef();


  return (
    <VStack
      minHeight={"100vh"}
      width="100%"
      className="bg-background overflow-y-scroll pb-[10vh]"
      spacing={0}
      padding={10}
      itemScope
      itemType="https://schema.org/Blog"
    >
      <HStack 
        className="w-full"
      >
        <NavBack />

        <Skeleton
          isLoaded={!loading} 
        >
          <Text
            className="font-semibold text-2xl text-writeup"
          >
            {name} {writeUpsCount ? `(${writeUpsCount})` : null}
          </Text>
        </Skeleton>


        <Spacer />

        { 
          account && author && created_at && author.username===account.username
          ?
            <Button
              onPress={deleteModal.onOpen}
              isIconOnly
              variant="light"
            >
              <Trash color="tomato" />
            </Button>

          :

        author && created_at ?

          <Skeleton
            isLoaded={!loading} 
          >
            <Chip>
              <Text
                className="font-semibold text-sm text-writeup"
              >

                Created by {author.full_name} on {hdate.prettyPrint(created_at)}
              </Text>
            </Chip>
          </Skeleton>

          : 
            null
        }


      </HStack>


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
                  onPress={()=>handleDelete()}
                >
                    Delete
                </Button>
              }

          </HStack>

          </VStack>
        </ChakraModalBody>


      </ChakraModalContent>
    </ChakraModal>



    <InfiniteScroll
      className="w-full h-full py-[10vh] gap-6 flex flex-wrap justify-start gap-y-10"
      initialLoad
      hasMore={!endReached}
      loadMore={()=>fetchWriteUps()}
      data={writeups}
      loader={
        <HStack
          minWidth={"100%"}
          padding={"2%"}
          paddingBottom={"10%"}
        >
          <Spacer/>
          <Spinner color="default" size="md" />
          <Spacer/>
        </HStack>
      }
      threshold={400}
      useWindow={true}
    >
      { 
        writeups.length ?
        writeups.map((w)=> {
          return (
            <WriteUpCard key={w.id} writeup={w} />
          )
        })

        : !loading && <Text fontSize={"small"}>no write ups found.</Text>
      }
    </InfiniteScroll>

   </VStack>
  )
}



export default ViewSeries;
