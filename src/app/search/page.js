'use client'

import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { CommandEmpty } from "cmdk";
import { ArrowLeft, Loader2, NotebookPen } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { AuthenticationDrawer } from "../components/authentication/auth-drawer";
import { NavBack } from "../components/helpers/NavBack";
import { NavigationBar } from "../components/Navigation";
import { ThemeSwitch } from "../components/themeSwitch";
import { UserCard } from "../components/UserCard";
import { WriteUpCard } from "../components/writeUpList/Card";
import { API_URL, isAuthenticated, toAuthHeaders } from "../utils/api";




const Page = () => {

  const [value, setValue] = useState('');
  const [loadingWriteUps, setLoadingWriteUps] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [writeUps, setWriteUps] = useState([]);
  const [accounts, setAccounts] = useState([]);


  const isDesktop = useMediaQuery({query: "(min-width: 768px) and (pointer: fine)"});


  const searchAccounts = async (query) => {
    setLoadingAccounts(true);

    if(!query){
      setLoadingAccounts(false);
      return;
    };

    const response = await fetch(API_URL+`account/search?username=${query}&full_name=${query}&bio=${query}&email=${query}`);

    setLoadingAccounts(false);

    return response;
  }


  const searchWriteUps = async (query) => {
    setLoadingWriteUps(true);

    if(!query){
      setLoadingWriteUps(false)
      return
    };

    const response = await fetch(API_URL+`writeup/list?search=${query}`);

    setLoadingWriteUps(false);

    return response;
  }



  const handleSearch = async (query) => {
    if(loadingAccounts || loadingWriteUps || !query) return;

    const accounts_res = await searchAccounts(query);
    const writeups_res = await searchWriteUps(query);

    if(accounts_res && accounts_res.ok)
    {
      let dat = await accounts_res.json();

      setAccounts(dat);
    }

    if(writeups_res && writeups_res.ok)
    {
      let dat = await writeups_res.json();

      setWriteUps(dat.results);
    }
  }



  return (
    <div className="w-[100svw] h-[100svh] bg-background">
      <div className="w-full h-[10svh] p-4 flex flex-row gap-5 border-b shadow-none justify-between fixed top-0 z-[40] bg-background">

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
            { isAuthenticated()

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


      <div className="w-full h-full flex flex-col pb-[10vh] pt-[10vh] items-center">

        {
          isDesktop
          &&
          <div className="w-full p-5">
              {/* show desktop navbar */}
              <NavBack />
          </div>
        }
        
        <div className="p-5 h-full w-[90svw] max-w-[700px]">
          <Command className="border">
            <CommandInput value={value} className="text-large" onValueChange={(e)=>{
              handleSearch(e);
              setValue(e);
            }} placeholder="search" onKeyDown={(e)=> {
              if(e.key==="Enter" || e.key==="Return")
              {
                setValue('');
              }
            }} />

            <CommandList className="pt-5 h-full">
              <CommandGroup heading="Accounts">
                {
                  accounts && accounts.length
                  ?
                  accounts.map((account, i)=> {
                    return <CommandItem key={i} className="w-full"><UserCard 
                      key={i}
                      avatarUrl={account.avatar} 
                      username={account.username}
                      fullName={account.full_name}
                    /></CommandItem>
                  })

                  :
                    null
                }
              </CommandGroup>
            </CommandList>



            <CommandList className="pt-5 h-full border-t">
              <CommandGroup heading="Write Ups" className="w-full min-h-full">
                {
                  writeUps && writeUps.length
                  ?
                  writeUps.map((writeup, i)=> {
                    return <CommandItem key={i} className="w-full"><WriteUpCard
                      writeup={writeup}
                      snippet={true}
                    /></CommandItem> })

                  :
                    null
                }
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>


      <NavigationBar selected="search" />

    </div>
  )
}


export default Page;
