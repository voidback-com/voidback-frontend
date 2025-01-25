'use client'
import { createContext, useContext } from "react";
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
