'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AtSign, Bell, Home, MessageSquare, Search, Settings, User } from "lucide-react";



export const NavigationBarMobile = ({selected, setSelected, notificationsCount}) => {



  return (
    <div className="w-full h-[10svh] border-t fixed bottom-0 border-grid z-[40] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-row justify-around">

      <Button onClick={()=>setSelected("home")} variant="ghost" className={`h-full w-full rounded-none hover:bg-transparent focus:bg-transparent outline-none ${selected==="home" ? "text-foreground border-b-[2px] border-b-foreground" : "text-muted-foreground"}`}>
        <Home className="min-w-[25px] min-h-[25px]" />
      </Button>


      <Button variant="ghost" onClick={()=>setSelected("search")} className={`h-full w-full hover:bg-transparent focus:bg-transparent rounded-none outline-none ${selected==="search" ? "text-foreground border-b-[2px] border-b-foreground" : "text-muted-foreground"}`}>
        <Search className="min-w-[25px] min-h-[25px]" />
      </Button>

      <Button onClick={()=>setSelected("threads")} variant="ghost" className={`h-full w-full hover:bg-transparent focus:bg-transparent rounded-none outline-none ${selected==="threads" ? "text-foreground border-b-[2px] border-b-foreground" : "text-muted-foreground"}`}>
        <AtSign className="min-w-[25px] min-h-[25px]" />
      </Button>


      <Button variant="ghost" onClick={()=>setSelected("notifications")} className={`h-full w-full hover:bg-transparent focus:bg-transparent rounded-none outline-none ${selected==="notifications" ? "text-foreground border-b-[2px] border-b-foreground" : "text-muted-foreground"}`}>
        <Bell className="min-w-[25px] min-h-[25px]" />
        {notificationsCount ? <Badge className={"bg-blue-500 text-white font-semibold"}>{notificationsCount}</Badge> : null}
      </Button>




      <Button variant="ghost" onClick={()=>setSelected("settings")} className={`h-full w-full hover:bg-transparent focus:bg-transparent rounded-none outline-none ${selected==="settings" ? "text-foreground border-b-[2px] border-b-foreground" : "text-muted-foreground"}`}>
        <Settings className="min-w-[25px] min-h-[25px]" />
      </Button>

      <Button variant="ghost" onClick={()=>setSelected("profile")} className={`h-full w-full hover:bg-transparent focus:bg-transparent rounded-none outline-none ${selected==="profile" ? "text-foreground border-b-[2px] border-b-foreground" : "text-muted-foreground"}`}>

        <User className="min-w-[25px] min-h-[25px]" />

      </Button>



    </div>
  )
}
