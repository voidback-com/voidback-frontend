'use client'
import { useContext, useEffect, useState } from "react";
import { API_URL, getAccessToken, isAuthenticated, toAuthHeaders, WS_NOTIFICATIONS_COUNT } from "@/app/configs/api";





const notificatitonsContext = () => {

  
  const [newNotifications, setNewNotifications] = useState(false);




  const readNotification = async () => {
    await fetch(API_URL+`notifications/read`, {
      method: "GET",
      headers: toAuthHeaders({})
    })
  }


  const getNotifications = async (skip, limit) => {
    const response = await fetch(API_URL+`notifications?skip=${skip}&limit=${limit}`, {
      method: "GET",
      headers: toAuthHeaders({}),
    })

    const data = await response.json();

    if(response.status===200)
    {
      if(data && data.length)
        await readNotification();
      return data;
    }
    
  }


  const deleteNotification = async (pk) => {
    return await fetch(API_URL+`notifications/delete/${pk}`, {
      method: "GET",
      headers: toAuthHeaders({})
    })
  }


  const deleteAllNotifications = async () => {
    return await fetch(API_URL+`notifications/delete/all`, {
      method: "GET",
      headers: toAuthHeaders({})
    })
  }


  let ws = null;

  if(isAuthenticated()){

    ws = new WebSocket(WS_NOTIFICATIONS_COUNT);


  }


  useEffect(()=> {

    if(ws){
      ws.onopen = (event) => {
        ws.send(JSON.stringify({"token": getAccessToken()}));
      }

      ws.onmessage = (event) => {
        const json = JSON.parse(event.data);

        if(json.status===0)
        {
          setNewNotifications(json.data.count);
        }
        else{
          setNewNotifications(0);
        }
       
      }

      ws.onclose = (ev) => {
        setNewNotifications(0);
      }

     const interval = setInterval(()=> {
        ws.send(JSON.stringify({"token": getAccessToken()}));
      }, 5000); 
      
      return ()=> clearInterval(interval);
    }

  }, [])



  const value = {
    getNotifications,
    

    deleteNotification,
    deleteAllNotifications,

    newNotifications,
    setNewNotifications,
  };

  return value;

};



export default notificatitonsContext;

