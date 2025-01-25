'use client'
import { 
  VStack,
  Container,
  Text,
  Spacer,
  Show,
} from "@chakra-ui/react";
import { 
  Button, 
  Skeleton, 
  Tooltip, 
  Spinner,
  Chip
} from "@nextui-org/react";

import { useState, useContext, useEffect } from "react";
import { Home, Inbox, Bell, MessageCircle, Folder, Database, ShoppingCart, Info, TrendingUp } from '@geist-ui/icons'
import { useRouter } from "next/navigation";
import { DataHubContext } from "@/app/providers/DataHubProvider";
import { SidebarContext } from "@/app/providers/FeedsProvider/SidebarProvider";




export const NavButton = ({icon, handler, label, disabled, popoverText, badgeValue}) => {
  return (
    popoverText
      ?

      <Tooltip content={popoverText}>
        <div className="w-full h-full">
          <Button 
            isDisabled={disabled}
            startContent={icon} 
            onPress={handler}
            className="bg-background border-x-1 rounded-none h-full w-full"
          >
            <Show breakpoint="(min-width: 1000px)">
              {label}
            </Show>
          </Button>
        </div>
      </Tooltip>

    :
      <div className="w-full h-full">
        <Button 
        isDisabled={disabled}
        startContent={icon} 
        onPress={handler}
        className="bg-background border-x-1 rounded-none h-full w-full"
        >
          <Show breakpoint="(min-width: 1000px)">
            {!badgeValue && label}
          </Show>
          {
            badgeValue
            &&
            <Chip radius="full" color="primary" variant="solid" size="sm">
              {badgeValue}
            </Chip>
          }
        </Button>
       
      </div>

  )
}



export const NavBarTop = ({
  refresh, 
  myQueriesDrawer,
  helpDrawer
}) => {

  const [queries, setQueries] = useState(null);
  const [queriesLeft, setQueriesLeft] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getQueries } = useContext(DataHubContext);
  const { newNotifications } = useContext(SidebarContext);

  const fetchQueries = async () => {
    setLoading(true);

    const response = await getQueries();

    const data = await response.json();

    if(response.status==200){
      setQueries(data.queries);
      setQueriesLeft(data.queriesLeft);
    }

    setLoading(false);
  }


  useEffect(()=> {
    if(refresh)
    {
      fetchQueries();
    }
    else if(!loading && !queries)
    {
      fetchQueries();
    }
  }, [!queries, refresh])


  const router = useRouter();

  if(loading)
    return <div className="w[100%] h-[8vh] border-1 flex flex-row justify-around place-items-center"><Spinner color="default" size="md" /></div>




  return (
    <div
      className="w-[100%] h-[8vh] min-h-[60px] border-1 flex flex-row"
    >
        <NavButton 
          icon={<Home />} 
          label={"Home"}  
          handler={()=>router.push("/home/foryou")}
        />

        <NavButton 
          icon={<Bell />} 
          label={"Notifications"}  
          handler={()=>router.push("/notifications")}
          badgeValue={newNotifications>0 ? newNotifications : null}
        />

        <NavButton 
          icon={<MessageCircle />} 
          label={"DMs"}  
          handler={()=>router.push("/dm")}
          disabled
          popoverText={"This feature is currently in development."}
        />

        <NavButton 
          icon={<TrendingUp />} 
          disabled
          label={"Investor Hub"}  
          popoverText={"This feature is currently in development."}
          handler={()=>router.push("/investor-hub")}
        />


        <NavButton 
          icon={<Folder />} 
          label={"My Queries"}  
          handler={myQueriesDrawer.onOpenChange}
        />


        <NavButton 
          icon={<Database />} 
          label={`${queriesLeft} Queries Left`}
        />

        <NavButton 
          icon={<ShoppingCart />} 
          disabled
          label={"Buy Queries"}
          popoverText={"This feature is currently in development."}
        />

        <NavButton icon={<Info />} label={"Help"} handler={helpDrawer.onOpenChange}  />

    </div>
  )
}



