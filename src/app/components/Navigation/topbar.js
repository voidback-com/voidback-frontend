'use client'
import { NotebookPen } from "lucide-react"
import Link from "next/link"
import { AuthenticationDrawer } from "../authentication/auth-drawer"
import { ThemeSwitch } from "../themeSwitch"
import { isAuthenticated } from "@/app/utils/api"


export const TopBar = () => {


  return (
    <div className="w-full h-[10svh] p-4 flex flex-row gap-5 border-b shadow-none justify-between fixed top-0 z-[40] bg-background">

      <div className="w-fit flex flex-row gap-3">
        <div className="h-full flex flex-col justify-center">
          <img
            src="/logo.png"
            className="w-[50px] animate-spin animate-once animate-ease-in-out"
          />
        </div>

        <div className="h-full flex flex-col justify-center h-full gap-0 space-y-0">
          <p className="text-[25px]" style={{ fontWeight: 800 }}>Voidback.</p>

          <p className="font-black w-fit self-start pl-1 text-[11px] font-roboto font-black">Open Source, Open Minds.</p>
        </div>
      </div>



      <div className="h-full w-fit flex flex-row gap-2">

        <div className="w-fit h-full flex flex-col justify-center">
          {isAuthenticated()

            ?
            <Link href={"/editor"} className="w-fit h-fit">
              <NotebookPen size={18} />
            </Link>
            :
            <AuthenticationDrawer />
          }
        </div>

        <div className="w-fit h-full flex flex-col justify-center">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  )

}
