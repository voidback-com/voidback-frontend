'use client'
import { getCookie, setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
 





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


export const shouldRefresh = () => {
  const tok = getCookie("authTok");

  if(tok)
  {
    let token = JSON.parse(tok);

    if(token)
    {
      const d = jwtDecode(token.access);

      if(d){
        if(Date.now() > d.exp * 1000)
        {
          return true;
        }
        else{
          return false;
        }
      }
      else{
        return true;
      }
    }
  }
  return false;
}


export const toAuthHeaders = (headers) => {
  if(shouldRefresh()){
     const r = getRefresh();

      if(r)
      {
        fetch(API_URL+"token/refresh", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({"refresh": r})
        }).then((res)=> {
          if(res.status===200)
            return res.json();
        }).then( (response)=> {
          if(response)
          {
            setCookie("authTok", JSON.stringify(response));
          }
          else{
            logoutUser();
          }
        }).catch((err)=> {
        })
      }
  }
   

  try{
    const tok = JSON.parse(getCookie("authTok"));
  

    if(tok)
    {
      if(tok)
      {
        headers["Authorization"] = `Bearer ${tok.access}`
        return headers;
      }
    }

  } catch(err){

  }

  return headers;
}


export const getRefresh = () => {
  const r = getCookie("authTok");

  if(r)
  {
    let tok = JSON.parse(r);
    if(tok)
    {
      return tok.refresh;
    }
  }

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



export const getAccessToken = () => {
  const r = getCookie("authTok");

  if(r)
  {
    let tok = JSON.parse(r);
    if(tok)
    {
      return tok.access;
    }
  }


}



