'use client'
import { createContext } from "react";
import researchPaperContext from "./ResearchPaperContext";
import notificatitonsContext from "./NotificationsContext";




export const SidebarContext = createContext({});



const SidebarContextProvider = ({children}) => {
 

  const value = {
    ...researchPaperContext(),
    ...notificatitonsContext()
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;

};



export default SidebarContextProvider;

