'use client'
import { API_URL, getToken, isAuthenticated, WS_NOTIFICATIONS_COUNT } from "@/app/utils/api";
import { Command, CommandGroup, CommandList, CommandInput, CommandItem } from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { UserCard } from "../UserCard";
import { WriteUpCard } from "../writeUpList/Card";
import { NavigationBarDesktop } from "./NavigationBarDesktop";
import { NavigationBarMobile } from "./NavigationBarMobile";



export const NavigationBar = ({feed, selected="home"}) => {
  
  const [path, setPath] = useState(selected);
  const [count, setCount] = useState(0);


  const token = getToken();


  useEffect(()=> {
    if(token)
    {

      const ws = new WebSocket(WS_NOTIFICATIONS_COUNT, [token]);

      ws.onopen = (event) => {
        //
      }

      ws.onmessage = (event) => {
        const json = JSON.parse(event.data);


        if(json?.count)
        {
          setCount(json.count);
        }
      }


      ws.onclose = (ev) => {
        console.log(ev)
        return ()=> {
          ws.close();
        }

      };     

      ws.onerror = (event) => {
        console.error("WebSocket error", event);
      };


      const interval = setInterval(()=> {
        try{
          if(ws.readyState!==WebSocket.CLOSED)
          {
            ws.send("ping");
          }
        }catch(err){
          //
        }
      }, 5000); 
    

      return ()=> clearInterval(interval);

    }
  }, [token])


  const isDesktop = useMediaQuery({query: "(min-width: 768px) and (pointer: fine)"});


  const router = useRouter();



  useEffect(()=> {


    if(path==="home")
    {
      router.push("/");
    }

    else if(path!==selected)
    {
      if(!window.location.pathname.includes(path))
      {
        router.push(`/${path}`);
      }
    }
      
  }, [path])


  const [value, setValue] = useState('');
  const [loadingWriteUps, setLoadingWriteUps] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [writeUps, setWriteUps] = useState([]);
  const [accounts, setAccounts] = useState([]);


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
      <div className={`w-full overflow-y-hidden max-h-[100svh] ${isDesktop?"flex flex-row justify-between":"flex flex-col"}`}>
        {
          !isDesktop
          ?
          <>
            {feed}
            <NavigationBarMobile notificationsCount={count} setSelected={setPath} selected={path} />
          </>
        :
          <>
            <NavigationBarDesktop notificationsCount={count} setSelected={setPath} selected={path} />
            {feed}
            <div className="w-[50svw] border-l flex flex-col z-0 h-[100%] min-h-[100svh] pt-[10vh] p-5">
              <div className="py-5 h-[90svh]">
               <Command className="border h-full">
                  <CommandInput value={value} onValueChange={(e)=>{
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
          </>
        }
      </div>
  )
}
