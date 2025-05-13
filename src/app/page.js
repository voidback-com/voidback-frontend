'use server'
import { AuthenticationDrawer } from "./components/authentication/auth-drawer";
import { ThemeSwitch } from "./components/themeSwitch";
import { API_URL } from "./utils/api";




const Page = async () => {





  return (
    <div
      className="w-full min-h-[100vh] overflow-x-hidden bg-default flex flex-col overflow-y-hidden justify-between fixed"
    >

      <div className="w-full h-[10vh] bg-background p-4 flex flex-row gap-5 border-b shadow-none justify-between">

        <div className="w-fit flex flex-row gap-3">
          <div className="h-full flex flex-col justify-center">
            <img
              src="logo.png"
              className="w-[50px] animate-spin animate-once animate-ease-in-out"
            />
          </div>

          <div className="h-full flex flex-col justify-center h-full gap-0 space-y-0">
            <p className="text-[25px]" style={{fontWeight: 800}}>Voidback.</p>

            <p className="font-black w-fit self-start pl-1 text-[11px] font-roboto font-black">A platform by nerds for nerds.</p>
          </div>
        </div>

          

        <div className="h-full w-fit flex flex-row gap-2">

          <div className="w-fit h-full flex flex-col justify-center">
            <AuthenticationDrawer />
          </div>

          <div className="w-fit h-full flex flex-col justify-center">
            <ThemeSwitch />
          </div>
        </div>
      </div>


      {/* category cards here */}

    </div>

  )
}


export default Page;
