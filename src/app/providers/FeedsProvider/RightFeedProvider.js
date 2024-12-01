'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { API_URL, errorToReadable, isError, toAuthHeaders } from "@/app/configs/api";
import { GreedyFetchContext } from "../greedyFetch";
import { AnalyticsContext } from "../AnalyticsProvider";



export const RightFeedContext = createContext({});



const RightFeedContextProvider = ({children}) => {

  const [topSymbols, setTopSymbols] = useState(null);
  const [topSymbolsLoading, setTopSymbolsLoading] = useState(false);
  const [topSymbolsError, setTopSymbolsError] = useState(null);
  const [topSymbolsPostsCount, setTopSymbolsPostsCount] = useState(false);

  const [topHashtags, setTopHashtags] = useState(null);
  const [topHashtagsLoading, setTopHashtagsLoading] = useState(false);
  const [topHashtagsError, setTopHashtagsError] = useState(null);
  const [topHashtagsPostsCount, setTopHashtagsPostsCount] = useState(false);

  const [searchLoading, setSearchLoading] = useState(false);


  const [explorePosts, setExplorePosts] = useState(null);
  const [exploreAccounts, setExploreAccounts] = useState(null);
  const [exploreResearchPapers, setExploreResearchPapers] = useState(null);


  const [postsEndReached, setPostsEndReached] = useState(false);
  const [researchEndReached, setResearchEndReached] = useState(false);
  const [accountEndReached, setAccountEndReached] = useState(false);


  const { gfetches, gRequest } = useContext(GreedyFetchContext);


  const { logEvent } = useContext(AnalyticsContext);


  // symbols posts count
  const getSymbolsPostsCount = async (symbols) => {
    let requests = [];
    let endpoints = [];


    for(let j = 0; j < symbols.length; j++)
    {
      let k = `/api/symbols/postCount/${symbols[j].id}`;

      requests.push(gRequest(k, "GET", {}, {}, true));

      endpoints.push(k);

    }

    const responses = await gfetches(requests);


    let data = [];

    for(let i = 0; i < endpoints.length; i++)
    {
      data.push(responses[endpoints[i]]);
    }

    return data;
  }


  // trending symbols
  const getTopSymbols = async () => {
    setTopSymbolsLoading(true);

    await fetch(API_URL+"symbols/trending", {
      method: "GET"
    }).then((res)=> {
        if(res.status==200)
          return res.json();
        else{
          setTopSymbolsError(res);
        }

      }).then(async (response)=> {
        if(response)
        {
          setTopSymbols(response);

          const data = await getSymbolsPostsCount(response);

          if(!isError(data))
            setTopSymbolsPostsCount(data);
          else{
            setTopSymbolsError(errorToReadable(data));
          }
        }
        setTopSymbolsLoading(false);
      })



  }


  // hashtags posts count
  const getHashtagsPostsCount = async (hashtags) => {
    let requests = [];
    let endpoints = [];

    for(let j = 0; j < hashtags.length; j++)
    {
      let k = `/api/hashtags/postCount/${hashtags[j].id}`;

      requests.push(gRequest(k, "GET", {}, {}, true));

      endpoints.push(k);

    }

    const responses = await gfetches(requests);

    let data = [];

    for(let i = 0; i < endpoints.length; i++)
    {
      data.push(responses[endpoints[i]]);
    }

    return data;
  }




  // trending hashtags
  const getTopHashtags = async () => {
    setTopHashtagsLoading(true);

    await fetch(API_URL+"hashtags/trending", {
      method: "GET"
    }).then((res)=> {
        if(res.status==200)
          return res.json();
        else{
          setTopHashtagsError(res);
        }

      }).then(async (response)=> {
        if(response)
        {
          setTopHashtags(response);

          const data = await getHashtagsPostsCount(response);

          if(!isError(data))
            setTopHashtagsPostsCount(data);
          else{
            setTopHashtagsError(errorToReadable(data));
          }

        }

        setTopHashtagsLoading(false);
      })
  }


  const getTopSearchQueries = async () => {
    const data = await fetch(API_URL+"searchQuery?object=explore", {
      method: "GET"
    }).then((res)=> {
      if(res.status===200)
        return res.json();
    });

    return data;
  }



  const getSimialQueries = async (query) => {
    const data = await fetch(API_URL+`searchQuery?query=${query}&object=explore`, {
      method: "GET"
    }).then((res)=> {
      if(res.status===200)
        return res.json();
    });

    return data;
  }



  const insertSearchQuery = async (query) => {

    logEvent("explore-search-query", window.location.href, {"query": query});


    const data = await fetch(API_URL+'searchQuery', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"query": query, "object_name": "explore"})
    }).then((res)=> {
      if(res.status===200)
        return res.json();
    });

    return data;
  }


  const exploreSearchCount = async (query) => {
    const response = await fetch(API_URL+`exploreSearchCount?query=${query}`, {
      method: "GET"
    });

    const data = response.json();

    if(response.status===200)
      return data;
  }
  
  const exploreSearch = async (query, category) => {
    setSearchLoading(true);

    let skip = 0;
    let limit = 5;

     switch(category)
      {
        case "posts":
          if(explorePosts&&explorePosts.length)
          {
            skip = explorePosts.length+1
            limit = skip+5
          }
          break;

        case "research":
          if(exploreResearchPapers&&exploreResearchPapers.length)
          {
            skip = exploreResearchPapers.length+1
            limit = skip+5
          }
          break;

        case "accounts":
         if(exploreAccounts&&exploreAccounts.length)
          {
            skip = exploreAccounts.length+1
            limit = skip+5
          }
          break;
        
      }

    const response = await fetch(API_URL+`exploreSearch?query=${query}&skip=${skip}&limit=${limit}&category=${category}`, {
      method: "GET"
    })

    const data = await response.json();


    if(response.status===200)
    {
      switch(category)
      {
        case "posts":
          if(skip)
          {
            setExplorePosts(p=>[...p, ...data]);
          }
          else{
            setExplorePosts(data);
          }

          if(!data.length)
            setPostsEndReached(true);

          break;

        case "research":
          if(skip)
          {
            setExploreResearchPapers(p=>[...p, ...data]);
          }
          else{
            setExploreResearchPapers(data);
          }

          if(!data.length)
            setResearchEndReached(true);

          break;

        case "accounts":
           if(skip)
          {
            setExploreAccounts(p=>[...p, ...data]);
          }
          else{
            setExploreAccounts(data);
          }

          if(!data.length)
            setAccountEndReached(true);
          break;
      }

 
      if (skip===0)
        logEvent("explore-category-search-query", window.location.href, {"query": query, "category": category});


    }
    else{
      return data;
    }
    
    setSearchLoading(false);

    return null;
  }



  const value = {
    exploreSearch,
    exploreSearchCount,
    searchLoading,

    explorePosts,
    exploreAccounts,
    exploreResearchPapers,
    postsEndReached,
    researchEndReached,
    accountEndReached,

    topSymbols,
    topSymbolsError,
    topSymbolsLoading,
    topSymbolsPostsCount,

    topHashtags,
    topHashtagsError,
    topHashtagsLoading,
    topHashtagsPostsCount,

    getTopHashtags,
    getHashtagsPostsCount,
    getTopSymbols,


    getTopSearchQueries,
    getSimialQueries,
    insertSearchQuery,

  };

  return <RightFeedContext.Provider value={value}>{children}</RightFeedContext.Provider>;

};



export default RightFeedContextProvider;

