'use client'
import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { useState, createContext, useEffect, useMemo } from "react";


export const DataHubContext = createContext();


const DataHubContextProvider = ({children}) => {

  const querySymbolSentiments = async (data) => {
    return fetch(API_URL+'data-hub/query', {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify(data)
    });
  }

  const getQueries = async () =>  {
    return fetch(API_URL+'data-hub/query', {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"})
    });
  }


  const getFeedbackVotes = async (ticker) => {
    return fetch(API_URL+`data-hub/poll/feedback?ticker=${ticker}`, {
      method: "GET",
      headers: toAuthHeaders({}),
    });
  }


  const getPositionVotes = async (ticker) => {
    return fetch(API_URL+`data-hub/poll/position?ticker=${ticker}`, {
      method: "GET",
      headers: toAuthHeaders({}),
    });
  }



  const voteFeedback = async (ticker, position) => {
    return fetch(API_URL+'data-hub/poll/feedback', {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({ticker, position})
    });
  }



  const votePosition = async (ticker, position) => {
    return fetch(API_URL+'data-hub/poll/position', {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({ticker, position})
    });
  }


  const data = {
    querySymbolSentiments,

    getQueries,

    getFeedbackVotes,
    getPositionVotes,

    voteFeedback,
    votePosition
  }

  return (
    <DataHubContext.Provider
      value={data}
    >
      {children}
    </DataHubContext.Provider>
  )
}



export default DataHubContextProvider;
