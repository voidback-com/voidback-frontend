'use client'
import { toAuthHeaders } from "@/app/configs/api";
import { useState, createContext, useEffect, useMemo } from "react";


export const DataHubContext = createContext();


const DataHubContextProvider = ({children}) => {


  const fetchSymbolSentiment = async (symbol) => {
  }


  const data = {

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
