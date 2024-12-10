'use client'
import { 
  Spacer,
  HStack,
  Text,
  VStack,
  Show
} from "@chakra-ui/react";
import { API_URL, getAccessToken, isAuthenticated, toAuthHeaders, WS_ANALYTICS } from "@/app/configs/api";
import { useEffect, useState, useContext } from "react";
import { Tab, Tabs, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Users } from "@geist-ui/icons";
import { AutoAwesomeMosaicTwoTone } from "@mui/icons-material";
import { AuthContext } from "@/app/providers/AuthProvider";
import { Cities, Countries, StatusCard } from "./cards";



export const UsersActivity = () => {
  
  const { account } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);


  useEffect(()=> {

    if(isAuthenticated() && account && account.is_staff){


      const ws = new WebSocket(WS_ANALYTICS+"usersActivity");


      ws.onopen = (event) => {
        ws.send(JSON.stringify({"token": getAccessToken()}));
        setLoading(true);
      }

      ws.onmessage = (event) => {

        const json = JSON.parse(event.data);

        if(json.status===0)
        {
          setData(json.data);
        }
        else{
          setData(false);
        }

        setLoading(false);
      }

      ws.onclose = (ev) => {
        setData(false);

        return ()=> {
          ws.close();
        }

      };

      const interval = setInterval(()=> {
        try{
          if(ws.readyState!==WebSocket.CLOSED)
          {
            ws.send(JSON.stringify({"token": getAccessToken()}));
            setLoading(true);
          }
        }catch(err){
          //
        }
      }, 5000); 
    
      return ()=> clearInterval(interval);

    }

  }, [account])



  return (
    <div
      className="w-full h-[90%] bg-background border-0 p-4 grid grid-rows-4 grid-flow-col gap-1"
    >
      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.logins} description={"Logins"} icon="login" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.logouts} description={"Logouts"} icon="logout" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.otps_sent} description={"Otps sent"} icon="otp" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.otps_verified} description={"Otps verified"} icon="otp-verified" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.deleted_accounts} description={"Deleted accounts"} icon="deleted-account" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.signups} description={"Signups"} icon="login" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.follows} description={"Follows"} icon="follows" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.unfollows} description={"Unfollows"} icon="deleted-account" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.account_reports_today} description={"Account reports"} icon="reports" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <Countries countries={data && data.countries} />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <Cities cities={data && data.cities} />
      </Skeleton>

    </div>
  );
}



export const PositiveEvents = () => {
  return <div></div>;
}




export const NegativeEvents = () => {
  return <div></div>;
}


export const NeutralEvents = () => {
  return <div></div>;
}


