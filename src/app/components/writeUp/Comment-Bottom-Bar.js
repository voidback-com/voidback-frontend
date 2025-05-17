'use client'

import { API_URL, toAuthHeaders } from "@/app/utils/api";
import { Button } from "@/components/ui/button";
import { Eye, Heart, HeartOff, Loader2, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react"
import { CommentsDrawer } from "./Comments-drawer";



export const CommentBottomBar = ({id, wid}) => {

  const [impression, setImpression] = useState(0);
  const [likes, setLikes] = useState(false);
  const [commentsCount, setCommentsCount] = useState(false);
  const [showComments, setShowComments] = useState(false);


  const fetchCommentsCount = async () => {
    const response = await fetch(API_URL+`writeup/comments/count?writeup=${wid}&parent=${id}`);

    const data = await response.json();


    if(response.ok)
    {
      setCommentsCount(data.count);
    }
  }


  const fetchLikes = async () => {
    const response = await fetch(API_URL+`writeup/comment/impressions?comment=${id}`, {
      method: "GET",
      headers: toAuthHeaders({})
    });


    const data = await response.json();

    if(response.ok)
    {
      setLikes(data.likes);
      setImpression(data.impression);
    }
  }


  const handleLike = async () => {

    setLikes(false);

    await fetch(API_URL+`writeup/comment/like?comment=${id}`, {
      method: "GET",
      headers: toAuthHeaders({})
    });


    setImpression(!impression);
    fetchLikes();

  }

  useEffect(()=> {
    if(likes===false)
    {
      fetchLikes();
    }
  }, [!likes])



  useEffect(()=> {
    if(commentsCount===false)
    {
      fetchCommentsCount();
    }
  }, [!commentsCount])


  const num = require("human-readable-numbers");


  return (
    <div className="min-h-[10vh] p-5 flex flex-row justify-around">
      <Button 
        variant="ghost" 
        className="p-2"
        onClick={()=>handleLike()}
      >
        {impression===1 ? <Heart className="fill-foreground" /> : <Heart />}

        {likes===false ? <Loader2 className="animate-spin" /> : num.toHumanString(likes)}
      </Button>

      <Button 
        variant="ghost" 
        className="p-2"
        onClick={()=>setShowComments(!showComments)}
      >
        <MessageSquare className="fill-foreground" />
        {commentsCount===false ? <Loader2 className="animate-spin" /> : num.toHumanString(commentsCount)}
      </Button>


      <CommentsDrawer commentId={id} wid={wid} count={commentsCount} isOpen={showComments} setIsOpen={setShowComments} />

    </div>
  )
}

