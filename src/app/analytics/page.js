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
import { Home, Users } from "@geist-ui/icons";
import { UsersActivity } from "./components/LeftBarOptions";



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
          key={"home"}
          className="flex flex-row justify-start"
          title={
            <HStack spacing={5}>
              <Home size={25} />
              <Show breakpoint="(min-width: 1000px)">
                <Text fontSize={"medium"} fontWeight={600}>Home</Text>
              </Show>
          </HStack>
          }
        />




        <Tab
          key={"usersActivity"}
          className="flex flex-row justify-start"
          title={
            <HStack spacing={5}>
              <Users size={25} />
              <Show breakpoint="(min-width: 1000px)">
                <Text fontSize={"medium"} fontWeight={600}>Users Events</Text>
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



const Analytics = () => {

  const [currentSelection, setCurrentSelection] = useState("usersActivity");


  const router = useRouter();


  const renderSelection = () => {
    switch(currentSelection) {
      case "usersActivity":
        return <UsersActivity />;

      case "home":
        return router.replace("/home");

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
