'use client'
import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import PostsContext from "./PostsContext";
import PlatformContext from "./PlatformContext";



export const LeftFeedContext = createContext();



const LeftFeedContextProvider = ({children}) => {


  const postsContext = useContext(PostsContext());
  const platformContext = useContext(PlatformContext());


  const value = {

    ...postsContext,

    ...platformContext

  };


  return <LeftFeedContext.Provider value={value}>{children}</LeftFeedContext.Provider>;
};



export default LeftFeedContextProvider;
