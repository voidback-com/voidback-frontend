'use client'
import { API_URL, errorToReadable, toAuthHeaders } from "@/app/utils/api"
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeletons } from "../writeUpList";
import { CommentCard } from "./Comment-card";




export const CommentsList = ({wid, setComments, comments, commentId=null}) => {

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextPage, setNextPage] = useState(null);


  const { toast } = useToast();


  const loadMore = async () => {

    if(loading || !hasMore) return;

    setLoading(true);


    const response = await fetch(nextPage ? nextPage : API_URL+`writeup/comments?writeup=${wid}&page_size=5&page=1${commentId ? `&parent=${commentId}` : ""}`, {
      method: "GET"
    });


    if(!response.ok)
    {
      toast({
        title: "Failed to retreive comments!",
        description: errorToReadable(await response.json())
      });
      setHasMore(false);
    }

    else{
      const { results, next } = await response.json();

      if(next)
        setNextPage(next);
      else
        setHasMore(false);


      if(results.length)
      {
        if(comments.length)
          setComments(prev => [...prev, ...results]);

        else
          setComments(results);
      }
    }

    setLoading(false);

  }


  useEffect(()=> {
    if(!comments.length && !loading && hasMore)
      loadMore();
  }, [!comments.length, !loading, hasMore])



  const renderItem = (item, i) => {
    return <CommentCard comment={item} key={`${item.id}-${i}-${item.created_at}`} />
  }


  return (
     <div id="scroll-div-comments" className="w-full max-h-[100%] overflow-y-scroll pb-[29vh]">
      <InfiniteScroll
        hasMore={hasMore}
        dataLength={comments}
        next={loadMore}
        scrollableTarget="scroll-div-comments"
        loader={<div className="w-full flex flex-row justify-center"><Loader2 className="animate-spin" /></div>}
      >
        {comments.length ? comments.map((writeup, i)=> renderItem(writeup, i)) : null}
      </InfiniteScroll>
      </div>   
  )
}


