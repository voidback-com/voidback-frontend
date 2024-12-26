'use client'
import { toAuthHeaders } from "@/app/configs/api";
import { useState, createContext, useEffect, useMemo } from "react";


export const GreedyFetchContext = createContext();


const GreedyFetchContextProvider = ({children}) => {


  const GFETCH_URL = process.env.GFETCH_URL;


  const getLocalCached = async (requestObject) => {
    let v = localStorage.getItem(JSON.stringify(requestObject));

    if(v){
      let o = JSON.parse(v);

      if(o.expires > Date.now())
      {
        return o.response;
      }
      else{
        localStorage.removeItem(JSON.stringify(requestObject));
      }
    }
    return null;
  }


  const setLocalCached = (requestObject, response) => {
    let exp = Date.now()+150000 // 2.5 minutes

    localStorage.setItem(JSON.stringify(requestObject), JSON.stringify({expires: exp.toString(), response: response}));

  }

  const deleteLocalCached = (requestObject) => {
    localStorage.removeItem(JSON.stringify(requestObject));
  }


  const getResponses = async (requests) => {

    const data = await fetch(GFETCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"requests": requests})
    })
    .then(async (response)=> {
        return response.json();
    }).catch((err)=> null);


    if(data)
      requests.forEach((req)=> {
        if(req.isCached)
        {
          setLocalCached(req, data[req.endpoint]);
        }
      })

    return data;
  }


  const gfetch = async (endpoint, requestMethod="GET", headers=Object(), body=Object(), isCached=false) => {

    const request = {endpoint: endpoint, method: requestMethod, headers: headers, body: body, isCached: isCached};

    if(isCached)
    {
      let res = getLocalCached(request);
      if(res)
        return res;

    }

    const responses = await getResponses([request]);

    if(isCached){
      setLocalCached(request, responses[endpoint]);
    }

    if(responses)
      return responses[endpoint];
  }


  const gRequest = (endpoint, requestMethod="GET", headers=Object(), body=Object(), isCached=false) => {
    return {endpoint: endpoint, method: requestMethod, headers: headers, body: body, isCached: isCached};
  }


  const gfetches = async (requestObjects) => {
    let cachedResponses = new Object();
    let cached = false;
    let failed = false;

    for(let i = 0; i < requestObjects.length; i++)
    {
      if(requestObjects[i].isCached)
      {
        cached = true;
        const d = await getLocalCached(requestObjects[i]);


        if(d){
          cachedResponses[requestObjects[i].endpoint] = d;
        }
        else{
          cached = false;
          failed=true;
        }
      }
    }

    if(!failed && cached && Object.keys(cachedResponses).length > 0)
    {
      return cachedResponses;
    }

    return await getResponses(requestObjects);
  }


  const data = {
    gfetch,
    gfetches,
    gRequest,

    getLocalCached,
    setLocalCached,
    deleteLocalCached
  }

  return (
    <GreedyFetchContext.Provider
      value={data}
    >
      {children}
    </GreedyFetchContext.Provider>
  )
}



export default GreedyFetchContextProvider;
