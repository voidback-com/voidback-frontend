'use client'

import { accountCacheDelete, isAuthenticated } from "@/app/utils/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { deleteCookie } from "cookies-next/client"
import { Bell, Home, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"





export const NavigationBarDesktop = ({setSelected, selected, notificationsCount}) => {

  const router = useRouter();

  const logout = () => {
    deleteCookie("authTok");
    accountCacheDelete();

    router.refresh();
  }


  return (
    <div className="w-1/2 h-[100svh] border-r bg-background pt-[10vh]">
      <div className="w-fit p-8 h-full flex flex-col gap-5">
        <Button onClick={()=>setSelected("home")} variant="ghost" className={`h-fit w-fit rounded-none hover:bg-transparent focus:bg-transparent outline-none gap-5 ${selected==="home" ? "text-foreground border-l-[2px] border-l-foreground" : "text-muted-foreground"}`}>
          <Home className="min-w-[30px] min-h-[30px]" />

          <p className={`${selected==="home" ? "font-semibold" : "font-normal"} text-xl`}>
            Home
          </p>
        </Button>


        <Button onClick={()=>setSelected("notifications")} variant="ghost" className={`h-fit w-fit hover:bg-transparent focus:bg-transparent rounded-none outline-none gap-5 ${selected==="notifications" ? "text-foreground border-l-[2px] border-l-foreground" : "text-muted-foreground"}`}>


          <Bell className="min-w-[30px] min-h-[30px]" />

        {notificationsCount ? <Badge className={"bg-blue-500 text-white font-semibold"}>{notificationsCount}</Badge> : null}
          <p className={`${selected==="notifications" && "font-semibold"} text-xl`}>
            Notifications
          </p>
        </Button>



        <Button variant="ghost" onClick={()=>setSelected("settings")} className={`h-fit w-fit hover:bg-transparent focus:bg-transparent rounded-none outline-none gap-5 ${selected==="settings" ? "text-foreground border-l-[2px] border-l-foreground" : "text-muted-foreground"}`}>
          <Settings className="min-w-[30px] min-h-[30px]" />

          <p className={`${selected==="settings" && "font-semibold"} text-xl`}>
            Settings
          </p>
        </Button>

        <Button variant="ghost" onClick={()=>setSelected("profile")} className={`h-fit w-fit hover:bg-transparent focus:bg-transparent rounded-none outline-none gap-5 ${selected==="profile" ? "text-foreground border-l-[2px] border-l-foreground" : "text-muted-foreground"}`}>

          <User className="min-w-[25px] min-h-[25px]" />

          <p className={`${selected==="profile" && "font-semibold"} text-xl`}>
            Profile
          </p>
        </Button>


        <div className="w-full h-full flex flex-col justify-end gap-5">
          { isAuthenticated() &&
            <Button variant="outline" className="text-muted-foreground hover:bg-destructive" onClick={logout}>
              Logout <LogOut />
            </Button>
          }
          <div className="w-full h-fit flex flex-wrap gap-5 p-2 rounded-xl border">

            <Link className="text-muted-foreground text-large" href={"/voidback/about-us"}>
              About Us
            </Link>

            <Link className="text-muted-foreground text-large" href={"/voidback/privacy-policy"}>
              Privacy Policy
            </Link>


            <Link className="text-muted-foreground text-large" href={"/voidback/terms-of-service"}>
              Terms Of Service
            </Link>


            <Link className="text-muted-foreground text-large" href={"/voidback/contact-us"}>
              Contact Us
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}

