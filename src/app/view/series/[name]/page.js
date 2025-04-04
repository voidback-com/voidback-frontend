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
  HStack,
  Spacer
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import InfiniteScroll from "react-infinite-scroller";
import { WriteUpCard } from "@/app/home/components/WriteUpCard";
import { Spinner, Skeleton, Chip } from "@nextui-org/react";




const ViewSeries = ({ params }) => {

  const p = params;

  const name = decodeURI(p.name);

  document.title = name;


  const { getSeriesWriteups } = useContext(LeftFeedContext);


  const [writeups, setWriteups] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [writeUpsCount, setWriteUpsCount] = useState(0);
  const [created_at, setCreatedAt] = useState(false);
  const [author, setAuthor] = useState(false);



  const toast = useToast();


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

        <Skeleton
          isLoaded={!loading} 
        >
          { author && created_at ?

          <Chip>
            <Text
              className="font-semibold text-sm text-writeup"
            >

              Created by {author.full_name} on {hdate.prettyPrint(created_at)}
            </Text>
          </Chip>

            : null
          }
        </Skeleton>


      </HStack>



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
