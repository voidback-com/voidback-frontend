'use client'
import { createContext, useEffect, useState, useContext } from "react";
import { API_URL, errorToReadable, toAuthHeaders } from "@/app/configs/api";
import { AuthContext } from "../AuthProvider";
import { getImageClass } from "../helpers/nsfw";



export const EditorContext = createContext();



const EditorContextProvider = ({children}) => {


  const [writeUpError, setWriteUpError] = useState(null);
  const [writeUpLoading, setWriteUpLoading] = useState(false);
  const [writeUpSuccess, setWriteUpSuccess] = useState(null);
  const [lastWriteUpId, setLastWriteUpId] = useState(null);


  const { account } = useContext(AuthContext);


  const handleWriteUp = async (title, content, thumbnail, series, tags) => {

    if(!account) return;

    setWriteUpLoading(true);

    let formData = new FormData(); 
    
    if(thumbnail)
    {


      const imgClass = await getImageClass(thumbnail);


      if(imgClass==="nsfw")
      {
        setWriteUpError("The thumbnail was classified as not safe for work, please respect our terms of service.");
        setWriteUpLoading(false);
        return;
      }

      formData.append("thumbnail", thumbnail.file);
    }


    formData.append("writeUp", JSON.stringify({
      title: title,
      content: content,
      tags: tags,
      series: series,
      rank: 0
    }));



    return await fetch(API_URL+"writeup", {
      method: "POST",
      headers: toAuthHeaders({}),
      body: formData
    });
  }



  const getMySeries = async () => {
    return await fetch(API_URL+"getSeries", {
      method: "GET",
      headers: toAuthHeaders({})
    });
  }


  const newSeries = async (name) => {
    const response = await fetch(API_URL+"newSeries", {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({"name": name})
    });

    return response;
  }


  const value = {

    // creating writeup
    handleWriteUp,
    getMySeries,
    newSeries,

    // writeup loading, error and success
    writeUpLoading,
    writeUpSuccess,
    lastWriteUpId,
    writeUpError,


  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;

};



export default EditorContextProvider;

