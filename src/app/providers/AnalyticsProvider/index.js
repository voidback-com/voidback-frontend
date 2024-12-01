'use client'
import { API_URL, isAuthenticated, toAuthHeaders } from "@/app/configs/api";
import { createContext, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider";



export const AnalyticsContext = createContext();



const AnalyticsContextProvider = ({children}) => {


  const { account } = useContext(AuthContext);



  const logEvent = async (eventType, eventPath, data) => {

    let jdata = {
      event_path: eventPath,
      event_type: eventType,
      data: data,
    };

    if(account)
      jdata['account'] = account.username



    await fetch(API_URL+'analytics/logEvent', {
      headers: toAuthHeaders({"Content-Type": "application/json"}),
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

