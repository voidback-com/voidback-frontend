'use client'
import { createContext, useContext } from "react";
import PostsContext from "./PostsContext";
import PlatformContext from "./PlatformContext";
import EdgeRoomContext from "./EdgeRoomContext";



export const LeftFeedContext = createContext();



const LeftFeedContextProvider = ({children}) => {


  const postsContext = useContext(PostsContext());
  const platformContext = useContext(PlatformContext());
  const edgeRoomContext = useContext(EdgeRoomContext());


  const value = {

    ...postsContext,

    ...platformContext,

    ...edgeRoomContext

  };


  return <LeftFeedContext.Provider value={value}>{children}</LeftFeedContext.Provider>;
};



export default LeftFeedContextProvider;
