'use client'
import { 
  VStack,
  Container,
  Spacer,
  Text,
  useToast,
  ModalOverlay,
} from "@chakra-ui/react";
import { Button, useDisclosure, Divider, Modal, ModalBody, ModalHeader, ModalFooter, ModalContent, Chip, DateRangePicker, Input, Spinner, Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { useState, useContext, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Activity, Filter, Save, Search } from "@geist-ui/icons";
import { NavButton } from "./NavBar";
import { API_URL, errorToReadable } from "@/app/configs/api";
import { DataHubContext } from "@/app/providers/DataHubProvider";
import { useRouter } from "next/navigation";
import { Touchable } from "@/app/auth/components";



export const renderQueryResult = (queryLoading, queryResult, jsonQueryExport) => {

  const format = require("human-readable-numbers");

  const router = useRouter();


  const handleExport = () => {
    if(jsonQueryExport && queryResult)
    {
      const fname = `${queryResult.ticker}.json`;

      const jsn = JSON.stringify(jsonQueryExport);

      let e = document.createElement("a");
      e.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(jsn));
      e.setAttribute("download", fname);
      e.style.display = 'none';
      document.body.appendChild(e);

      e.click();

      document.body.removeChild(e);

    }
  }



  if(queryLoading)
    return (
    <div className="w-full flex flex-row justify-around place-items-center py-5">
      <Spinner color="default" size="lg" />
    </div>
  )

  if(!queryResult)
    return (
      <div className="w-full flex flex-row justify-around place-items-center py-5">
        <Chip className="border-1 rounded-sm p-4" variant="bordered" endContent={<Activity />}>
          No query made
        </Chip>
      </div>
    )

  return (
    <div className="w-full h-full flex flex-col">

      {/* top section */}
      <div
        className="h-[30%] w-full flex flex-row"
      >

        {/* Ticker chip */}
        <Chip 
          size="lg" 
          className="border-0 rounded-none bg-background p-4 h-full"
        >
          <Text 
            className="text-green-400 font-bold text-lg"
          >
          {queryResult.ticker}
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
                    {format.toHumanString(queryResult.totalPosts)}
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
                    {format.toHumanString(queryResult.totalViews)}
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
                    {format.toHumanString(queryResult.totalLikes)}
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
                    {format.toHumanString(queryResult.totalDislikes)}
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
              queryResult.topPost
              ?
                <Touchable
                  onClick={()=>router.push(`view/post/${queryResult.topPost.post.id}`)}
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
                  <Text fontSize={"medium"} fontWeight={600}>{format.toHumanString(queryResult.positiveSentiments.percentage)}%</Text>
              </div>


              {/* right card: positiveSentiments count */}
              <div className="w-1/2 h-full bg-background border-b-1 flex flex-row justify-around place-items-center">
                <Text fontSize={"medium"}  fontWeight={600}>{format.toHumanString(queryResult.positiveSentiments.count)}</Text>
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
                  <Text fontSize={"medium"} fontWeight={600}>{format.toHumanString(queryResult.negativeSentiments.percentage)}%</Text>
              </div>


              {/* right card: Negative Sentiments count */}
              <div className="w-1/2 h-full bg-background border-b-1 flex flex-row justify-around place-items-center">
                <Text fontSize={"medium"}  fontWeight={600}>{format.toHumanString(queryResult.negativeSentiments.count)}</Text>
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
                      <Text fontSize={"medium"}  fontWeight={600}>{format.toHumanString(queryResult.symbolPostsViewedEvents)}</Text>
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
                      <Text fontSize={"medium"}  fontWeight={600}>{format.toHumanString(queryResult.symbolsInForYous)}</Text>
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
                  <NavButton label="Export" icon={<Save />} handler={handleExport} />
                </div>

                <div className="w-1/2 p-4 flex flex-col gap-5 justify-around place-items-center">
                  <Chip size="sm" className="bg-background border-1 rounded-md p-2">
                    {queryResult.dateRange[0]}
                  </Chip>

                  <Text fontWeight={600} fontSize="medium" fontFamily={"sans-serif"}>To</Text>

                  <Chip size="sm" className="bg-background border-1 rounded-md p-2">

                    {queryResult.dateRange[1]}
                  </Chip>
                </div>
              </div>
            </div>

        </div>

      </div>
    </div>
  )
}





export const SymbolSentimentQueryCard = ({setRefresh, setTicker}) => {

  const [loadingSymbols, setLoadingSymbols] = useState(false);
  const [symbols, setSymbols] = useState([]);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  
  // api post request data (states)
  const [symbol, setSymbol] = useState(null);
  const [date, setDate] = useState(null);
  const [includes_Keywords, setIncludes_Keywords] = useState();
  const [jsonQueryExport, setJsonQueryExport] = useState(null);


  const { querySymbolSentiments } = useContext(DataHubContext);


  const toast = useToast();


  const handleQuery = async () => {
    setQueryLoading(true);

    let now = new Date();

    let sdate = {"year": now.getFullYear(), "month": now.getMonth()+1, "day": 1};

    let edate = {"year": now.getFullYear(), "month": now.getMonth()+1, "day": now.getDate()}

    if(date)
    {
      sdate = {"year": date.start.year, "month": date.start.month, "day":date.start.day};

      edate = {"year": date.end.year, "month": date.end.month, "day": date.end.day};
    }


    const qdata = {
      category: "symbol",
      symbol: symbol,
      startDate: sdate,
      endDate: edate,
      includes_keywords: !includes_Keywords ? " " : includes_Keywords
    };

    const response = await querySymbolSentiments(qdata).catch((err)=>{
      return JSON.stringify({"status": 400, "error": "check your internet connection!"});
    });

    const data = await response.json();

    if(response.status==200)
    {
      setQueryResult(data.query_results);
      setJsonQueryExport(data);
    }
    else{
      toast({
        title: "Error executing this query.",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      });
    }

    setRefresh(true);
    setQueryLoading(false);
  }

  const symbolAutocomplete = async (text) => {
    setLoadingSymbols(true);

    const data = await fetch(API_URL+`symbols/search?query=${text.toUpperCase()}`, {
      method: "GET"
    }).catch((err)=> {
        setLoadingSymbols(false);
        return;
      });

    const res = await data.json();

    if(data.status===200)
    {
      setSymbols(res);
    }

    setLoadingSymbols(false);
  }


  
  const renderSimilarQuery = (item) => {
    return (
      <AutocompleteItem 
        key={item.id}
        textValue={item.symbol}
      >
        <Text>
          {item.symbol}
        </Text>
      </AutocompleteItem>
    )
  }


  useEffect(()=> {
    if(queryResult)
    {
      setTicker(queryResult.ticker);
    }
  }, [queryResult])

  const filtersModal = useDisclosure();


  return (
    <div
      className="w-full h-full bg-background flex flex-col border-x-1 min-w-[550px]"
    >
      
      <div
        className="p-5 w-full flex flex-row justify-around gap-4"
      >
        <Autocomplete
        isLoading={loadingSymbols}
        label="Symbol Sentiments Query"
        labelPlacement="outside"
        classNames={{
          base: "max-w-md",
          listboxWrapper: "max-h-[320px]",
          selectorButton: "text-default-500",
        }}
        defaultItems={symbols}
        className="self-start"
        inputProps={{
          classNames: {
            inputWrapper: "rounded-md border-1"
          },
        }}
        listboxProps={{
          hideSelectedIcon: true,
          itemClasses: {
            base: [
              "rounded-medium",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "dark:data-[hover=true]:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[hover=true]:bg-default-200",
              "data-[selectable=true]:focus:bg-default-100",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
        aria-labelledby="symbol-query"
        placeholder="Symbol..."
        popoverProps={{
          offset: 10,
          classNames: {
            base: "rounded-large",
            content: "p-1 border-small border-default-100 bg-background",
          },
        }}
        radius="full"
        variant="bordered"
        onInputChange={symbolAutocomplete}
        onSelectionChange={(e)=>setSymbol(e)}
        items={symbols}
        >
          {
            (item) => renderSimilarQuery(item)
          }
        </Autocomplete>


        <div className="w-fit flex flex-row self-end gap-4">
          <Button
            size="md"
            variant="bordered"
            className="rounded-md border-1"
            startContent={<Filter />}
            onPress={filtersModal.onOpen}
          >
            filters
          </Button>

          <Button
            size="md"
            variant="bordered"
            className="rounded-md border-1"
            startContent={<Search />}
            onPress={handleQuery}
            isDisabled={!symbol?.length}
          >
            search
          </Button>
        </div>

      </div>

      <Divider />


      {renderQueryResult(queryLoading, queryResult, jsonQueryExport)} 



      {/* filters Modal */}
     <Modal isOpen={filtersModal.isOpen} isDismissable={false} onOpenChange={filtersModal.onOpenChange}>
        <ModalContent className="border-1 rounded-md bg-background">
          {(onClose)=> (
            <>
              <ModalHeader className="flex flex-col gap-1">Symbol Sentiments Query Filters</ModalHeader>

              <ModalBody
                className="flex flex-col h-full w-full"
              >

                {/* query date range */}
                <div
                  className="flex flex-row w-full h-full justify-around place-items-center"
                >
                  <DateRangePicker className="max-w-xs" label="Date Range" onChange={(e)=>setDate(e)} value={date} />

                </div>



                {/* keywords */}
                <div
                  className="flex flex-row w-full h-full justify-around place-items-center my-5"
                >
                  <Input onChange={(e)=>setIncludes_Keywords(e.target.value)} label="Includes Keywords" placeholder="keywords separated by space..." value={includes_Keywords} />
                </div>


              </ModalBody>

              <ModalFooter>
                <Button variant="bordered" className="border-1 rounded-md" onPress={onClose}>
                  save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  )
}





export const PollOption = ({vote, position, text, display, votes, totalVotes, selectedPosition}) => {

  const format = require("human-readable-numbers");

  let percentage = (votes/totalVotes)*100;

  if(percentage===Infinity)
  {
    percentage = 0;
  }


  if(!display)
    return (
        <div className="w-1/2 h-fit border-1 rounded-full p-4">
          <Button 
            className="bg-background border-0 h-full w-full"
            onPress={()=>vote(position)}
          >
            {text}
          </Button>
        </div>
    )

  else
    return (
      <div className="w-1/2 min-w-[400px] h-fit flex flex-row pb-10 my-5 bg-red">
        <div className={`w-full border-1 p-5 flex flex-col justify-around place-items-center ${selectedPosition===position ? null : "opacity-50"}`}>
          <Text
            fontSize={"sm"}
            fontFamily="sans-serif"
            fontWeight={600}
          >
            {text}
          </Text>
        </div>
      
        <div className={`w-full border-1 flex flex-col justify-around place-items-center ${selectedPosition===position ? null : "opacity-50"}`}>
          <Text
          fontWeight={600}
          >
            {percentage ? percentage : 0}%
          </Text>
        </div>

        <div className={`w-full border-1 flex flex-col justify-around place-items-center ${selectedPosition===position ? null : "opacity-50"}`}>
          <div className="flex flex-row justify-around place-items-center gap-2">
            <Text fontWeight={600}>
              {format.toHumanString(votes)}
            </Text>
            <Text fontWeight={600}>
              {votes===1?"vote":"votes"}
            </Text>
          </div>
        </div>
      </div>
    )
}






export const PositionPollCard = ({ticker}) => {

  const { votePosition, getPositionVotes } = useContext(DataHubContext);

  const [positionVotes, setPositionVotes] = useState(false); // array of different position votes
  const [votes, setVotes] = useState(false); // total votes
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);


  const fetchPositionVotes = async () => {
    setLoading(true);

    const response = await getPositionVotes(ticker);

    const data = await response.json();

    if(response.status===200)
    {
      setPositionVotes(data.positions);
      setVotes(data.votes)
      if(data.voted)
      {
        setDisplay(true);
        setSelectedPosition(data.voted);
      }
    }

    setLoading(false);
  }

  const toast = useToast();


  const vote = async (position) => {
    setLoading(true);

    const response = await votePosition(ticker, position);

    if(response.status===200)
    {
      fetchPositionVotes();
      setSelectedPosition(position);
      setDisplay(true);
    }

    else
      toast({
      "title": "error voting!",
      description: "please try again!",
      status: "error",
      duration: 4000
    });

    setLoading(false);
  }


  useEffect(()=> {
    if(ticker && !loading && !positionVotes)
    {
      fetchPositionVotes();
    }
  }, [ticker, !positionVotes, !loading])


  if(loading)
  {
    return (
      <div className="w-full flex flex-row justify-around place-items-center py-5 bg-background">
        <Spinner color="default" size="lg" />
      </div>
    )
  }


  if(!ticker)
  {
    return (
      <div className="w-full flex flex-row justify-around place-items-center py-5">
        <Chip className="border-1 rounded-sm p-4" variant="bordered" endContent={<Activity />}>
          No query made
        </Chip>
      </div>
    )
  }


  const format = require("human-readable-numbers");


  return (
    <div
      className="w-full bg-background flex flex-col border-r-1"
    >
      <div className="w-full max-h-[12%] min-h-[104px] flex flex-col justify-around place-items-center">
       <Text 
          className="text-green-400 font-bold text-lg"
        >
          {ticker}
        </Text>


       <Text 
          className={15}
          fontFamily={"sans-serif"}
          fontWeight={600}
        >
          What's your position?
        </Text>
      </div>

      <Divider />

      <div className="w-full flex flex-col justify-around place-items-center my-5">
        <div className="w-fit flex flex-row gap-2 border-1 rounded-md p-2">
         <Text fontWeight={600}>
            {format.toHumanString(votes)}
          </Text>

          <Text fontWeight={600}>
            {votes===1?"vote":"votes"}
          </Text>
        </div>
      </div>

      <div className="w-full h-full flex flex-col justify-around place-items-center">
        <PollOption 
          display={display} 
          text="Buy and Sell (short-term)" 
          vote={vote}
          position={1}
          totalVotes={votes}
          votes={positionVotes[0]} 
          selectedPosition={selectedPosition}
        />

        <PollOption 
          display={display} 
          text="Buy and Hold (long-term)" 
          vote={vote}
          position={2}
          totalVotes={votes}
          votes={positionVotes[1]} 
          selectedPosition={selectedPosition}
        />

        <PollOption 
          display={display} 
          text="Short Sell" 
          vote={vote}
          position={3}
          totalVotes={votes}
          votes={positionVotes[2]} 
          selectedPosition={selectedPosition}
        />

        <PollOption 
          display={display} 
          text="Neutral" 
          vote={vote}
          position={4}
          totalVotes={votes}
          votes={positionVotes[3]} 
          selectedPosition={selectedPosition}
        />


      </div>

    </div>
  )

}



export const FeedBackPollCard = ({ticker}) => {


  const { voteFeedback, getFeedbackVotes } = useContext(DataHubContext);

  const [feedbackVotes, setFeedbackVotes] = useState(false); // array of different position votes
  const [votes, setVotes] = useState(false); // total votes
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);


  const fetchFeedbackVotes = async () => {
    setLoading(true);

    const response = await getFeedbackVotes(ticker);

    const data = await response.json();

    if(response.status===200)
    {
      setFeedbackVotes(data.positions);
      setVotes(data.votes)
      if(data.voted)
      {
        setDisplay(true);
        setSelectedPosition(data.voted);
      }
    }

    setLoading(false);
  }

  const toast = useToast();


  const vote = async (position) => {
    setLoading(true);

    const response = await voteFeedback(ticker, position);

    if(response.status===200)
    {
      fetchFeedbackVotes();
      setDisplay(true);
      setSelectedPosition(position);
    }

    else
      toast({
      "title": "error voting!",
      description: "please try again!",
      status: "error",
      duration: 4000
    });

    setLoading(false);
  }


  useEffect(()=> {
    if(ticker && !loading && !feedbackVotes)
    {
      fetchFeedbackVotes();
    }
  }, [ticker, !feedbackVotes, !loading])


  if(loading)
  {
    return (
      <div className="w-full flex flex-row justify-around place-items-center py-5 bg-background">
        <Spinner color="default" size="lg" />
      </div>
    )
  }

  if(!ticker)
  {
    return (
      <div className="w-full flex flex-row justify-around place-items-center py-5">
        <Chip className="border-1 rounded-sm p-4" variant="bordered" endContent={<Activity />}>
          No query made
        </Chip>
      </div>
    )
  }

  const format = require("human-readable-numbers");


  return (
    <div
      className="w-full bg-background flex flex-col border-r-1"
    >
      <div className="w-full max-h-[12%] min-h-[104px] flex flex-col justify-around place-items-center">
       <Text 
          className="text-green-400 font-bold text-lg"
        >
          {ticker}
        </Text>


       <Text 
          className={15}
          fontFamily={"sans-serif"}
          fontWeight={600}
        >
          What do you make of the query and poll results?
        </Text>
      </div>

      <Divider />

      <div className="w-full flex flex-col justify-around place-items-center my-5">
        <div className="w-fit flex flex-row gap-2 border-1 rounded-md p-2">
         <Text fontWeight={600}>
            {format.toHumanString(votes)}
          </Text>

          <Text fontWeight={600}>
            {votes===1?"vote":"votes"}
          </Text>
        </div>
      </div>

      <div className="w-full h-full flex flex-col justify-around place-items-center">
        <PollOption 
          display={display} 
          text="Actionable information" 
          vote={vote}
          position={1}
          totalVotes={votes}
          votes={feedbackVotes[0]} 
          selectedPosition={selectedPosition}
        />

        <PollOption 
          display={display} 
          text="Insightful information" 
          vote={vote}
          position={2}
          totalVotes={votes}
          votes={feedbackVotes[1]} 
          selectedPosition={selectedPosition}
        />

        <PollOption 
          display={display} 
          text="Useless information" 
          vote={vote}
          position={3}
          totalVotes={votes}
          votes={feedbackVotes[2]} 
          selectedPosition={selectedPosition}
        />

        <PollOption 
          display={display} 
          text="Neutral" 
          vote={vote}
          position={4}
          totalVotes={votes}
          votes={feedbackVotes[3]} 
          selectedPosition={selectedPosition}
        />


      </div>

    </div>
  )
}


