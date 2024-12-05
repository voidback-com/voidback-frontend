'use client'
import { createContext, useEffect, useState, useContext } from "react";
import { afinn165FinancialMarketNews } from "afinn-165-financialmarketnews";
import sentimentExtras from "./sentiment";
import { pipeline, env } from "@xenova/transformers";
import { API_URL, errorToReadable, toAuthHeaders } from "@/app/configs/api";
import { AuthContext } from "../AuthProvider";
import { AnalyticsContext } from "../AnalyticsProvider";
import checkImage from "@/app/globalComponents/imageNSFW";



export const EditorContext = createContext();



const EditorContextProvider = ({children}) => {

  env.allowLocalModels = true;
  env.useBrowserCache = false;
  env.allowRemoteModels = false;

  env.localModelPath = '/models/';

  env.backends.onnx.wasm.wasmPaths = "/models/wasm/";



  const [postError, setPostError] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postSuccess, setPostSuccess] = useState(null);
  const [lastPostId, setLastPostId] = useState(null);


  const { account } = useContext(AuthContext);


  const { logEvent } = useContext(AnalyticsContext);



  const handlePostMetadata = async (post, text, partial_sentiment, symbols, hashtags, text_toxicity) => {
    let text_sentiment = "";


    // full sentiment analysis
    let sentiment_model = await pipeline("sentiment-analysis", "Xenova/distilbert-base-uncased-finetuned-sst-2-english");

    await sentiment_model(text).then((res)=> {
      text_sentiment = res[0].label;
    })


    const data = {
      symbols: symbols,
      hashtags: hashtags,
      post: post.id,
      symbols: symbols,
      text_sentiment: text_sentiment,
      partial_sentiment: partial_sentiment,
      text_toxicity: text_toxicity,
      text: text
    };


    await logEvent("new-post", window.location.href, {"sentiment": text_sentiment});

    await fetch(API_URL+`post/metadata`, {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify(data)
    }).catch((err)=>null);
  }


  const handlePost = async (content, text, attributes, image, video, parent_post) => {

    if(!account) return;

    setPostLoading(true);

    let formData = new FormData(); 


    formData.append("post", JSON.stringify({
      content: content,
      mentions: attributes.mentions,
      hashtags: attributes.hashtags,
      symbols: attributes.symbols,
      video: video,
      parent_post: parent_post
    }));

    
    if(image)
    {

      formData.append("image", image.file);
      const imgSafe = await checkImage(image);

      if(!imgSafe)
      {
        setPostError("The image was classified as not safe for work, please respect our terms of service.");
        setPostLoading(false);
        return;
      }
    }

    // toxicity analysis
    
    let toxicity_model = await pipeline("text-classification", "Xenova/toxic-bert");

    const text_toxicity = await toxicity_model(text, {topk: null});


    if(text_toxicity[0].score > 0.5)
    {
      setPostError("The text was classified as not safe for work, please respect our terms of service.");
      setPostLoading(false);
      return;
    }
    else{

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

          if(!data)
            return;

          // partial sentiment
          const sentiment = require("wink-sentiment");

          let result = await sentiment(text, {
            options: {
              extras: {
              ...afinn165FinancialMarketNews,
              ...sentimentExtras
            },
            
          }});


          await handlePostMetadata(data, text, result, attributes.symbols, attributes.hashtags, text_toxicity);


          if(!postError)
          {
            setLastPostId(data.id);
            setPostSuccess(1);
          }

          setPostLoading(false);
      })
    }
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

