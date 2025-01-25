'use client'
import { createContext, useEffect, useState, useContext } from "react";
import { API_URL, errorToReadable, toAuthHeaders } from "@/app/configs/api";
import { AuthContext } from "../AuthProvider";
import { AnalyticsContext } from "../AnalyticsProvider";
import { getImageClass, getTextToxicity } from "../helpers/nsfw";



export const EditorContext = createContext();



const EditorContextProvider = ({children}) => {


  const [postError, setPostError] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postSuccess, setPostSuccess] = useState(null);
  const [lastPostId, setLastPostId] = useState(null);


  const { account } = useContext(AuthContext);


  const handlePost = async (content, text, attributes, image, video, parent_post) => {

    if(!account) return;

    setPostLoading(true);

    let formData = new FormData(); 

    let rank = 0;
    
    if(image)
    {


      const imgClass = await getImageClass(image);

      if(imgClass==="NSFW")
      {
        setPostError("The image was classified as not safe for work, please respect our terms of service.");
        setPostLoading(false);
        return;
      }
    }

    // toxicity analysis
    const toxicity = await getTextToxicity(text);


    if(toxicity.label==="nsfw" && toxicity.score >= 0.5)
    {
      rank = -1*(toxicity.score*100);
    }


    formData.append("post", JSON.stringify({
      content: content,
      mentions: attributes.mentions,
      hashtags: attributes.hashtags,
      symbols: attributes.symbols,
      video: video,
      parent_post: parent_post,
      rank: rank
    }));


    formData.append("image", image.file);

    await fetch(API_URL+"post", {
      method: "POST",
      headers: toAuthHeaders({}),
      body: formData
    }).then(async (res)=> {
        if(res.status===200)
          return res.json();
        else
        {
          setPostError(errorToReadable(await res.json()));
          setPostLoading(false);
        }
      }).then(async (data)=> {
        if(!postError)
        {
          setLastPostId(data.id);
          setPostSuccess(1);
        }

        setPostLoading(false);
    })
  }

  const value = {



    // creating post
    handlePost,

    // post loading, error and success
    postLoading,
    postSuccess,
    lastPostId,
    postError,


  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;

};



export default EditorContextProvider;

