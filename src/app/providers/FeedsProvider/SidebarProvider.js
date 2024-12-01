'use client'
import { createContext, useEffect, useState, useContext } from "react";
import inboxContext from "./InboxContext";
import researchPaperContext from "./ResearchPaperContext";
import notificatitonsContext from "./NotificationsContext";




export const SidebarContext = createContext({});



const SidebarContextProvider = ({children}) => {
 

  const value = {
    ...inboxContext(),
    ...researchPaperContext(),
    ...notificatitonsContext()
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;

};



export default SidebarContextProvider;

