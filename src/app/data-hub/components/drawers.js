'use client'
import { useState, useEffect, useContext } from "react";
import { VStack, Text, useToast, HStack } from "@chakra-ui/react";
import { 
  Button, 
  Skeleton, 
  Tooltip, 
  Chip,
  Spinner,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  useDisclosure
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { DataHubContext } from "@/app/providers/DataHubProvider";
import { Touchable } from "@/app/auth/components";
import { NavButton } from "./NavBar";
import { RefreshCw, Save } from "@geist-ui/icons";



export const MyQueryDrawer = ({myQueriesDrawer}) => {

  const [queries, setQueries] = useState(false);
  const [loading, setLoading] = useState(false);

  const { getQueries, deleteQuery } = useContext(DataHubContext);

  const fetchQueries = async () => {
    setLoading(true);

    const response = await getQueries();

    const data = await response.json();

    if(response.status==200){
      setQueries(data.queries);
    }

    setLoading(false);
  }


  useEffect(()=> {
    if(!queries && !loading)
      fetchQueries();
  }, [!queries, myQueriesDrawer.isOpen])


  const format = require("human-readable-numbers");

  const router = useRouter();

  const toast = useToast();


  const handleQueryDeletion = async (qid) => {
    const res = await deleteQuery(qid);
    if(res.status===200)
    {
      setQueries(q=>q.filter((x)=>x.id!=qid));
    }
    else{
      toast({
        title: "Failed to delete query.",
        description: "check your internet connection!",
        status: "error",
        duration: 4000
      });
    }
  }


  const renderQueries = () => {

    if(!queries || loading)
      return <div className="w[100%] h-[8vh] border-1 flex flex-row justify-around place-items-center border-0"><Spinner color="default" size="md" /></div>


    const handleExport = (qres, q) => {
      const fname = `${qres.ticker}.json`;

      const jsn = JSON.stringify(q);

      let e = document.createElement("a");
      e.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(jsn));
      e.setAttribute("download", fname);
      e.style.display = 'none';
      document.body.appendChild(e);

      e.click();

      document.body.removeChild(e);
    }


    if(queries && !queries.length)
    {
      return (
        <div
          className="w-full flex flex-col justify-around place-items-center py-10 gap-5"
        >
          <Text
            fontSize={"medium"}
            fontWeight={600}
          >
            No queries made!
          </Text>

          <Button
            size="sm"
            variant="bordered"
            className="border-1"
            startContent={<RefreshCw size={18} />}
            onClick={fetchQueries}
          >
            refresh
          </Button>
        </div>
      )
    }


  return (
      <div className="flex flex-col h-full w-full gap-10 p-5 flex flex-col justify-around place-items-center">
      {
          queries.map((q) => {
            const {query_results} = q;


            return (

          <div className="w-fit h-full flex flex-col border-1 relative">
            {/* top section */}
            <div className="h-[10vh] w-full flex flex-row justify-around place-items-center border-b-1">
                  <Button
                    variant="bordered"
                    className="border-0"
                    size="sm"
                    color="danger"
                    onClick={()=>handleQueryDeletion(q.id)}
                  >
                    delete
                  </Button>
            </div>
            <div
              className="h-[40vh] w-full flex flex-row"
            >

              {/* Ticker chip */}
              <Chip
                size="lg" 
                className="border-0 rounded-none bg-background p-4 h-full"
              >
                <Text 
                  className="text-green-400 font-bold text-lg"
                >
                {query_results.ticker}
                </Text>
              </Chip>


              {/* Right top section */}
              <div className="w-full">


                {/* First row of (right top section)  */}
                <div
                  className="w-full h-full flex flex-row"
                >
                  
                  {/* First column of (right top section) (total posts & total views)  */}
                  <div className="w-1/2 h-full bg-background border-x-1 flex flex-col place-items-center">

                  {/* Total Posts row  */}
                    <div className="flex flex-row w-full h-full border-b-1 place-items-center justify-around gap-x-0">
                      <Text
                        fontSize={"medium"}
                        fontWeight={800}
                      >
                        Total Posts
                      </Text>

                      <Chip variant="bordered" className="border-1">
                        <Text
                          fontSize={"medium"}
                          fontWeight={500}
                        >
                          {format.toHumanString(query_results.totalPosts)}
                        </Text>
                      </Chip>
                    </div>


                    {/* Total Views row  */}
                    <div className="flex flex-row w-full h-full border-0 place-items-center justify-around">
                      <Text
                        fontSize={"medium"}
                        fontWeight={800}
                      >
                        Total Views
                      </Text>

                      <Chip variant="bordered" className="border-1">
                        <Text
                          fontSize={"medium"}
                          fontWeight={500}
                        >
                          {format.toHumanString(query_results.totalViews)}
                        </Text>
                      </Chip>
                    </div>
                  </div>


                  {/* Second column of (right top section) (total likes & total dislikes)  */}
                  <div className="w-1/2 bg-background border-0 flex flex-col place-items-center">

                    <div className="flex flex-row w-full h-full border-b-1 place-items-center justify-around">
                      <Text
                        fontSize={"medium"}
                        fontWeight={800}
                      >
                        Total Likes
                      </Text>


                      <Chip variant="bordered" className="border-1">
                        <Text
                          fontSize={"medium"}
                          fontWeight={500}
                        >
                          {format.toHumanString(query_results.totalLikes)}
                        </Text>
                      </Chip>
                    </div>

                    <div className="flex flex-row w-full h-full border-0 place-items-center justify-around">
                      <Text
                        fontSize={"medium"}
                        fontWeight={800}
                      >
                        Total Dislikes
                      </Text>

                      <Chip variant="bordered" className="border-1">
                        <Text
                          fontSize={"medium"}
                          fontWeight={500}
                        >
                          {format.toHumanString(query_results.totalDislikes)}
                        </Text>
                      </Chip>
                    </div>
                  </div>
                </div>

              </div>
            </div>


            {/* center section */}
            <div
              className="w-full h-full bg-background border-y-1"
            >

              {/* top center section*/}
              <div
                className="w-full h-1/2 flex flex-col justify-around place-items-center"
              >
                <div className="w-full h-full flex flex-row justify-around place-items-center">
                  <Text
                    fontSize={"medium"}
                    fontFamily="sans-serif"
                    fontWeight={600}
                    className="p-4"
                  >
                    Top Post for this query
                  </Text>
                </div>

                <div className="w-full h-full justify-around flex flex-row place-items-center">
                  {
                    query_results.topPost
                    ?
                      <Touchable
                        onClick={()=>router.push(`view/post/${query_results.topPost.post.id}`)}
                      >
                        <Chip
                          variant="bordered"
                          className="p-4 relative bottom-4 border-1"
                        >
                          Click To see the post
                        </Chip>
                      </Touchable>
                    :
                      <Text
                        fontSize={"small"}
                        fontWeight={600}
                        className="p-2 relative bottom-4 border-1 rounded-md"
                      >No top post for this query!</Text>
                  }
                </div>

              </div>


              {/* bottom center section*/}
              <div
                className="w-full h-1/2 border-t-1 flex flex-row"
              >
                {/* left column (Positive Sentiments) */}
                <div
                  className="bg-background flex flex-col h-full w-1/2"
                >
                  <div className="h-1/3 bg-background w-full flex flex-row">

                    {/* left card: positiveSentiments percentage */}
                    <div className="w-1/2 h-full bg-background border-r-1 border-b-1 flex flex-row justify-around place-items-center">
                        <Text fontSize={"medium"} fontWeight={600}>{format.toHumanString(query_results.positiveSentiments.percentage)}%</Text>
                    </div>


                    {/* right card: positiveSentiments count */}
                    <div className="w-1/2 h-full bg-background border-b-1 flex flex-row justify-around place-items-center">
                      <Text fontSize={"medium"}  fontWeight={600}>{format.toHumanString(query_results.positiveSentiments.count)}</Text>
                    </div>
                  </div>

                  <div className="top-5 relative w-full justify-around place-items-center">
                    <Text
                      fontSize={"medium"}
                      fontWeight={800}
                    >
                      Positive Sentiments
                    </Text>
                  </div>

                </div>


                {/* right column (Negative Sentiments) */}
                <div
                  className="bg-background border-l-1 flex flex-col h-full w-1/2"
                >
                  <div className="h-1/3 bg-background w-full flex flex-row">

                    {/* left card: Negative Sentiments percentage */}
                    <div className="w-1/2 h-full bg-background border-r-1 border-b-1 flex flex-row justify-around place-items-center">
                        <Text fontSize={"medium"} fontWeight={600}>{format.toHumanString(query_results.negativeSentiments.percentage)}%</Text>
                    </div>


                    {/* right card: Negative Sentiments count */}
                    <div className="w-1/2 h-full bg-background border-b-1 flex flex-row justify-around place-items-center">
                      <Text fontSize={"medium"}  fontWeight={600}>{format.toHumanString(query_results.negativeSentiments.count)}</Text>
                    </div>
                  </div>


                  <div className="top-5 relative w-full justify-around place-items-center">
                    <Text
                      fontSize={"medium"}
                      fontWeight={800}
                    >
                      Negative Sentiments
                    </Text>
                  </div>

                </div>

              </div>

            </div>


            {/* bottom section (Symbol-Posts-Viewed-Events) */}
            <div
              className="h-full w-full bg-background flex flex-row"
            >

              {/* symbol posts viewed events */}
              <div className="w-full h-full bg-background flex flex-col">
                  <div className="w-full justify-around place-items-center flex flex-col gap-0 border-b-1">
                    <div className="w-full flex flex-row h-1/4">


                      {/* symbolPosts Viewed events */}
                        <div className="w-full h-full bg-background border-0 flex flex-row justify-around place-items-center">
                          <Chip variant="bordered" className="my-5 border-1">
                            <Text fontSize={"medium"}  fontWeight={600}>{format.toHumanString(query_results.symbolPostsViewedEvents)}</Text>
                          </Chip>
                        </div>
                    </div>

                  <div className="w-full flex flex-col justify-around place-items-center py-0 gap-2">
                      <Text
                        fontSize={"medium"}
                        fontWeight={800}
                      >
                        Symbol-Posts Viewed (Events)
                      </Text>

                      <Text
                        fontSize={"small"}
                        maxW="40%"
                      >
                      The amount of times people clicked on the symbol and navigated to see posts it's mentioned in.
                      </Text>
                    </div>

                  </div>


                  {/* bottom section (footer) */}
                  <div className="w-full h-full bg-background flex flex-row">
                   <div
                      className="bg-background border-l-1 flex flex-col h-full w-1/2"
                    >
                      <div className="h-1/3 bg-background w-full flex flex-row">

                        {/* center card: Negative Sentiments count */}
                        <div className="w-full h-full bg-background border-0 flex flex-row justify-around place-items-center my-2">
                          <Chip variant="bordered" className="border-1">
                            <Text fontSize={"medium"}  fontWeight={600}>{format.toHumanString(query_results.symbolsInForYous)}</Text>
                          </Chip>
                        </div>
                      </div>


                      <div className="w-full justify-around place-items-center my-5 flex flex-col gap-2">
                        <Text
                          fontSize={"medium"}
                          fontWeight={800}
                        >
                          Symbol in ForYous
                        </Text>

                        <Text
                          fontSize={"small"}
                          maxW="90%"
                        >
                          The number of personalized ForYou's this symbol is included in.
                        </Text>

                      </div>
                    </div>


                  {/* export json query results */}
                    <div className="w-1/2 h-full bg-background border-0 flex flex-row">
                      <div className="w-1/2">
                        <NavButton label="Export" icon={<Save />} handler={()=>handleExport(query_results, q)} />
                      </div>

                      <div className="w-1/2 p-4 flex flex-col gap-5 justify-around place-items-center">
                        <Chip size="sm" className="bg-background border-1 rounded-md p-2">
                          {query_results.dateRange[0]}
                        </Chip>

                        <Text fontWeight={600} fontSize="medium" fontFamily={"sans-serif"}>To</Text>

                        <Chip size="sm" className="bg-background border-1 rounded-md p-2">

                          {query_results.dateRange[1]}
                        </Chip>
                      </div>
                    </div>
                  </div>

              </div>

            </div>
          </div>
            )
          })}
        </div>
      )
  }

  return (
      <Drawer
        isOpen={myQueriesDrawer.isOpen}
        onOpenChange={myQueriesDrawer.onOpenChange} 
        placement="bottom"
        size="full"
      >
        <DrawerContent
          className="bg-background h-full w-full pb-10"
        >
          {(onClose)=> (
            <>
            <DrawerBody className="w-full h-full">
              {renderQueries()}
            </DrawerBody>
          </>
          )}

      </DrawerContent>
      </Drawer>
  )
}


export const HelpDrawer = ({drawer}) => {

  return (
    <Drawer
      isOpen={drawer.isOpen}
      onOpenChange={drawer.onOpenChange} 
      placement="bottom"
      size="full"
    >
      <DrawerContent
        className="bg-background h-full overflow-y-scroll w-full"
      >
        {(onClose)=> (
          <>
            <DrawerBody className="w-full h-full flex flex-col justify-around place-items-center overflow-y-scroll p-10">
                <Card
                  className="border-0 p-4 bg-background min-h-fit"
                >
                  <CardHeader>
                    <Text
                      fontSize={"large"}
                    >
                      1) Get started by typing the symbol you want to query
                    </Text>
                  </CardHeader>

                  <CardBody className="w-full h-full border-1 rounded-md">
                    <Image 
                      src="https://static.voidback.com/static/help/data-hub/1.png" 
                      className="object-fill w-[50vw] rounded-md border-1"
                    />
                  </CardBody>
                </Card>


                <Card
                  className="border-0 p-4 bg-background min-h-fit"
                >
                  <CardHeader>
                    <Text
                      fontSize={"large"}
                      maxW="50vw"
                    >
                    2) Filter the query and adjust the time range of your results as well as any specific keywords your looking for in the posts
                    </Text>
                  </CardHeader>

                  <CardBody className="w-full h-full border-1 rounded-md">
                    <Image 
                      src="https://static.voidback.com/static/help/data-hub/2.png" 
                      className="object-fill w-[50vw] rounded-md border-1"
                    />
                  </CardBody>
                </Card>


                <Card
                  className="border-0 p-4 bg-background min-h-fit"
                >
                  <CardHeader>
                    <Text
                      fontSize={"large"}
                      maxW="50vw"
                    >
                    3) Finally click search to retrieve the results of your query
                  </Text>
                  </CardHeader>

                  <CardBody className="w-fit h-fit border-1 rounded-md">
                    <Image 
                      src="https://static.voidback.com/static/help/data-hub/3.png" 
                      className="object-fill max-w-[50vw] max-h-[50vh] rounded-md border-1"
                    />
                  </CardBody>
                </Card>
            </DrawerBody>
          </>
        )}

    </DrawerContent>
    </Drawer>
  )
}


export const Drawers = ({
  myQueriesDrawer,
  helpDrawer,
}) => {
  return (
    <>
      <MyQueryDrawer myQueriesDrawer={myQueriesDrawer} />
      <HelpDrawer drawer={helpDrawer} />
    </>
  )
}
