'use client'
import { createContext } from "react";
import notificatitonsContext from "./NotificationsContext";




export const SidebarContext = createContext({});



const SidebarContextProvider = ({children}) => {
 

  const value = {
    ...notificatitonsContext()
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;

};



export default SidebarContextProvider;

