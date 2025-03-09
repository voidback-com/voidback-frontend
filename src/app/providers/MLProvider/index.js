'use client'
import { useState, useContext, useEffect, createContext } from "react";
import ModelMakerContext from "./modelMaker";



export const MLContext = createContext();



const MLContextProvider = ({children}) => {


  const modelMaker = useContext(ModelMakerContext());

  const data = {
    ...modelMaker
  };


  return (
    <MLContext.Provider value={data}>
      {children}
    </MLContext.Provider>
  )
}


export default MLContextProvider;
