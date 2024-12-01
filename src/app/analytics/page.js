'use client'
import { 
  Spacer,
  HStack,
  Text,
  Skeleton,
  VStack,
  Show
} from "@chakra-ui/react";
import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { PieChart } from "@geist-ui/icons";



const LeftSection = ({currentSelection, setCurrentSelection}) => {



  return (
    <VStack
      className="h-full bg-background w-fit p-4"
    >
      <Spacer />
      <Tabs
        variant="light"
        isVertical
        size="lg"
        fullWidth
        selectedKey={currentSelection}
        onSelectionChange={(e)=> {
          if(e!==currentSelection)
          {
            setCurrentSelection(e);
          }
        }}
      >
        <Tab
          key={"eventsOverview"}
          className="flex flex-row justify-start"
          title={
            <HStack spacing={5}>
              <PieChart size={25} />
              <Show breakpoint="(min-width: 1000px)">
                <Text fontSize={"medium"} fontWeight={600}>Events Overview</Text>
              </Show>
          </HStack>
          }
        />


      </Tabs>
      <Spacer />
      <Spacer />
      <Spacer />
    </VStack>
  )
}



const OverviewEvents = () => {
  const [eventsOverview, setEventsOverview] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();

  const getEventsOverview = async () => {

    const res = await fetch(API_URL+"analytics/eventsOverview", {
      method: "GET",
      headers: toAuthHeaders({})
    });


    const data = await res.json();

    if(res.status===200)
    {
      setEventsOverview(data)
    }
    else{
      setError(data);
    }

  }


  useEffect(()=> {
    if(!error && !eventsOverview)
    {
      getEventsOverview();
    }
  }, [!eventsOverview, !error])


  if(error)
    return router.push("/");

  return (
    <VStack overflowY={'scroll'} className="bg-background w-full h-full flex flex-col  content-center p-4 space-y-10 py-10">

        <Skeleton className="w-fit h-fit bg-yellow-200" isLoaded={eventsOverview}>
          <div 
            dangerouslySetInnerHTML={{__html: eventsOverview.postEvents}}/>
        </Skeleton>

        <Skeleton className="w-fit h-fit bg-red-200" isLoaded={eventsOverview}>
          <div 
          dangerouslySetInnerHTML={{__html: eventsOverview.ViewAccountEvents}}/>
        </Skeleton>

        <Skeleton className="w-fit h-fit bg-green-200" isLoaded={eventsOverview}>
          <div 
          dangerouslySetInnerHTML={{__html: eventsOverview.viewHashtagSymbolEvents}}/>
        </Skeleton>

        <Skeleton className="w-fit h-fit bg-blue-200" isLoaded={eventsOverview}>
          <div 
          dangerouslySetInnerHTML={{__html: eventsOverview.exploreEvents}}/>
        </Skeleton>


        <Skeleton className="w-fit h-fit bg-yellow-200" isLoaded={eventsOverview}>
          <div 
          dangerouslySetInnerHTML={{__html: eventsOverview.researchEvents}}/>
        </Skeleton>


    </VStack>
  )

}


const Analytics = () => {

  const [currentSelection, setCurrentSelection] = useState("eventsOverview");


  const renderSelection = () => {
    switch(currentSelection) {
      case "eventsOverview":
        return <OverviewEvents />;

    }

  }

  
  return (
     <HStack
      className="w-full h-[100vh] bg-background"
      overflowY={"hidden"}
    >
      <LeftSection currentSelection={currentSelection} setCurrentSelection={setCurrentSelection} />

      {renderSelection()}

      </HStack>
  )
}



export default Analytics;

// export const dynamic = 'force-dynamic';
