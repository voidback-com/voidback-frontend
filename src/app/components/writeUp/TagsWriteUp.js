'use client'

import { API_URL } from "@/app/utils/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react"
import { WriteUpList } from "../writeUpList";
import { useEffect } from "react";



export default function TagsWriteUps({ tag }) {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextPage, setNextPage] = useState(null);


  const { toast } = useToast();


  const loadMore = async () => {

    setLoading(true);

    const response = await fetch(nextPage ? nextPage : API_URL + `writeup/list?page_size=5&page=1&tag=${tag}`);

    const data = await response.json();


    if (!response.ok) {
      setLoading(false);
      setHasMore(false);
      toast({
        title: "something went wrong!",
        description: "please refresh the page."
      });
    }

    else {
      if (nextPage) {
        setItems(p => [...p, ...data.results]);
      }
      else {
        setItems(data.results);
      }

      if (!data.next) {
        setHasMore(false);
        setNextPage(null);
      }
      else {
        setNextPage(data.next);
      }

      setLoading(false);
    }

  }


  useEffect(() => {
    if (!items.length && !loading && hasMore) {
      loadMore();
    }
  }, [!items, !loading, hasMore])




  return (
    <WriteUpList
      loadMore={loadMore}
      loading={loading}
      hasMore={hasMore}
      writeUps={items}
    />
  )
}
