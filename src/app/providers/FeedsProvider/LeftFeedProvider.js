'use client'
import { createContext, useContext } from "react";
import notificatitonsContext from "./NotificationsContext";
import PlatformContext from "./PlatformContext";
import WriteUpsContext from "./WriteupsContext";



export const LeftFeedContext = createContext();



const LeftFeedContextProvider = ({children}) => {


  const platformContext = useContext(PlatformContext());
  const WriteUpsContextData = useContext(WriteUpsContext());

  const notificationsContextData = useContext(notificatitonsContext());


  const value = {

    ...platformContext,

    ...WriteUpsContextData,

    ...notificationsContextData

  };


  return <LeftFeedContext.Provider value={value}>{children}</LeftFeedContext.Provider>;
};



export default LeftFeedContextProvider;
