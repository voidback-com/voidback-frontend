'use client'
import { 
  VStack,
  Container,
  Text,
  Spacer,
  Show
} from "@chakra-ui/react";
import { Button } from "@nextui-org/react";
import { Home, Inbox, Bell, MessageCircle, Folder, Database, ShoppingCart, Info } from '@geist-ui/icons'
import { useRouter } from "next/navigation";



const NavButton = ({icon, handler, label}) => {
  return (
    <Button 
      startContent={icon} 
      onPress={handler}
      className="bg-background border-x-1 rounded-none h-full w-full"
    >
      <Show breakpoint="(min-width: 1000px)">
        {label}
      </Show>
    </Button>
  )
}



export const NavBarTop = () => {

  const router = useRouter();

  return (
    <div
      className="w-[100%] h-[8vh] border-1 flex flex-row"
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
      />

      <NavButton 
        icon={<Inbox />} 
        label={"Inbox"}  
        handler={()=>router.push("/inbox")}
      />

      <NavButton 
        icon={<MessageCircle />} 
        label={"Chat"}  
      />

      <NavButton 
        icon={<Folder />} 
        label={"My Queries"}  
      />

      <NavButton 
        icon={<Database />} 
        label={"1000 Queries Left"}
      />

      <NavButton 
        icon={<ShoppingCart />} 
        label={"Buy Queries"}
      />

      <NavButton icon={<Info />} label={"Help"}  />

    </div>
  )
}



