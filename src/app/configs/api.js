'use client'
import { getCookie } from "cookies-next";




export const API_URL = process.env.API_URL;
export const WS_NOTIFICATIONS_COUNT = process.env.WS_NOTIFICATIONS_COUNT;
export const WS_ANALYTICS = process.env.WS_ANALYTICS;
export const WS_DMS = process.env.WS_DMS;


export const isAuthenticated = () => {

  const tok = getCookie("authTok");

  if(tok)
  {
    return true;
  }

  return false;

}


export const toAuthHeaders = (headers) => {
  try{
    const tok = JSON.parse(getCookie("authTok"));
  

    if(tok)
    {
      if(tok)
      {
        headers["Authorization"] = `Token ${tok.token}`
        return headers;
      }
    }

  } catch(err){

  }

  return headers;
}



export const errorToReadable = (errorObj) => {
  let messages = [];

  if(!errorObj)
    return "An unknown error occurred!";

  Object.keys(errorObj).map((key)=> {
    let v = errorObj[key];
    if(typeof v === Array)
      v = v[0];
    
    messages.push(`${key}: ${v}`);
  })

  let res = "";

  messages.forEach((f)=> {
    res+=f+'\n';
  })

  return res;
}



export const isError = (obj) => {
  if(obj === null || obj === undefined)
    return false;

  if("details" in obj){
    return true;
  }

  else if("message" in obj){
    return true;
  }

  else if(!obj){
    return true;
  }

  else{
    return false;
  }
}



