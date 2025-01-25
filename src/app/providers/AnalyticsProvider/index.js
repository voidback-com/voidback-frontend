'use client'
import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { createContext } from "react";



export const AnalyticsContext = createContext();



const AnalyticsContextProvider = ({children}) => {


  const logEvent = async (eventType, eventPath, data) => {

    let jdata = {
      event_path: eventPath,
      event_type: eventType,
      data: data,
    };



    await fetch(API_URL+'analytics/logEvent', {
      headers: toAuthHeaders({
        "Content-Type": "application/json",
        "User-Agent": navigator.userAgent.toString()
      }),
      method: "POST",
      body: JSON.stringify(jdata)
    });

  }



  const value = {
    logEvent
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;

};



export default AnalyticsContextProvider;

