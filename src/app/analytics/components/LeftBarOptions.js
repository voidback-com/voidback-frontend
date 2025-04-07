'use client'
import { 
  Spacer,
  HStack,
  Text,
  VStack,
  Show
} from "@chakra-ui/react";
import { API_URL, isAuthenticated, toAuthHeaders, WS_ANALYTICS } from "@/app/configs/api";
import { useEffect, useState, useContext } from "react";
import { Tab, Tabs, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Users } from "@geist-ui/icons";
import { AutoAwesomeMosaicTwoTone } from "@mui/icons-material";
import { AuthContext } from "@/app/providers/AuthProvider";
import { Cities, Countries, StatusCard } from "./cards";
import { getCookie } from "cookies-next";



export const UsersActivity = () => {
  
  const { account } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);


  useEffect(()=> {

    if(isAuthenticated()){


      const ws = new WebSocket(WS_ANALYTICS+"usersActivity");


      ws.onopen = (event) => {
        ws.send(getCookie("authTok"));
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
        ws.send(getCookie("authTok"));
          }
        }catch(err){
          //
        }
      }, 8000); // 8-sec
    
      return ()=> clearInterval(interval);

    }

  }, [])



  return (
    <div
      className="w-fit h-[90%] bg-background border-0 p-4 grid grid-rows-4 grid-flow-col gap-[3vw]"
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
  
  const { account } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);


  useEffect(()=> {

    if(isAuthenticated()){


      const ws = new WebSocket(WS_ANALYTICS+"positiveEvents");


      ws.onopen = (event) => {
        ws.send(getCookie("authTok"));
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
        ws.send(getCookie("authTok"));
          }
        }catch(err){
          //
        }
      }, 8000); 
    
      return ()=> clearInterval(interval);

    }

  }, [])



  return (
    <div
      className="w-fit h-[90%] bg-background border-0 p-4 grid grid-rows-4 grid-flow-col gap-[4vw]"
    >
      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.new_posts} description={"New Posts"} icon="plus" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.posts_viewed} description={"Posts Viewed"} icon="eye" />
      </Skeleton>


      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.liked_posts} description={"Posts Liked"} icon="heart" />
      </Skeleton>


      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.view_research} description={"Research Viewed"} icon="eye" />
      </Skeleton>


      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.view_account_posts} description={"Account posts viewed"} icon="eye" />
      </Skeleton>


      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.view_account_liked_posts} description={"Viewed Account liked posts"} icon="heart" />
      </Skeleton>


      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.make_research_impression} description={"Research Impressions Made"} icon="chart" />
      </Skeleton>


      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.view_myresearch} description={"My research viewed"} icon="eye" />
      </Skeleton>




    </div>
  );
}



export const NegativeEvents = () => {
  
  const { account } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);


  useEffect(()=> {

    if(isAuthenticated()){

      console.log(222)

      const ws = new WebSocket(WS_ANALYTICS+"negativeEvents");


      ws.onopen = (event) => {
        ws.send(getCookie("authTok"));
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
        ws.send(getCookie("authTok"));
          }
        }catch(err){
          //
        }
      }, 8000); 
    
      return ()=> clearInterval(interval);

    }

  }, [])



  return (
    <div
      className="w-fit h-[90%] bg-background border-0 p-4 grid grid-rows-3 grid-flow-col gap-[3vw]"
    >
      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.deleted_posts} description={"Deleted Posts"} icon="trash" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.unliked_posts} description={"Unliked Posts"} icon="chart" />
      </Skeleton>


      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.disliked_posts} description={"Disliked Posts"} icon="chart" />
      </Skeleton>


      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.deleted_research} description={"Deleted Research"} icon="trash" />
      </Skeleton>


      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.research_reports} description={"Research Reports"} icon="reports" />
      </Skeleton>


      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data  && data.post_reports} description={"Post Reports"} icon="reports" />
      </Skeleton>

    </div>
  );
}




export const NeutralEvents = () => {
  

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);


  useEffect(()=> {

    if(isAuthenticated()){


      const ws = new WebSocket(WS_ANALYTICS+"neutralEvents");


      ws.onopen = (event) => {
        ws.send(getCookie("authTok"));
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
        ws.send(getCookie("authTok"));
          }
        }catch(err){
          //
        }
      }, 8000); 
    
      return ()=> clearInterval(interval);

    }

  }, [])



  return (
    <div
      className="w-fit h-[90%] bg-background border-0 p-4 grid grid-rows-3 grid-flow-col gap-[3vw]"
    >
      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.explore_queries} description={"Explore Queries"} icon="chart" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.explore_category_queries} description={"Explore Category Queries"} icon="chart" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.search_queries} description={"Search Queries"} icon="chart" />
      </Skeleton>

      <Skeleton isLoaded={!loading} className="w-fit h-fit">
        <StatusCard number={data && data.research_queries} description={"Research Queries"} icon="chart" />
      </Skeleton>

    </div>
  );
}





