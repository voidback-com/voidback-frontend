'use client'
import { createContext, useContext } from "react";
import PlatformContext from "./PlatformContext";
import WriteUpsContext from "./WriteupsContext";



export const LeftFeedContext = createContext();



const LeftFeedContextProvider = ({children}) => {


  const platformContext = useContext(PlatformContext());
  const WriteUpsContextData = useContext(WriteUpsContext());


  const value = {

    ...platformContext,

    ...WriteUpsContextData

  };


  return <LeftFeedContext.Provider value={value}>{children}</LeftFeedContext.Provider>;
};



export default LeftFeedContextProvider;
