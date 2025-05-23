'use client'
import { API_URL } from "@/app/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState, useCallback, useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component";
import { useMediaQuery } from "react-responsive";
import { ViewportList } from "react-viewport-list";
import { WriteUpCard } from "./Card";


export const Skeletons = ({size}) => {
  
  return (
    <div className="w-full h-full flex flex-col gap-1">
      {
        Array(size).fill(null).map((n, i)=> {
          return <Skeleton className={"h-[250px] w-full rounded-none"} key={i} />
        })
      }
    </div>
  )
}



export const WriteUpList = ({writeUps, loading, hasMore, loadMore, noPad}) => {




  const renderItem = (item, i) => {
    return <WriteUpCard writeup={item} key={item.id} firstRendered={i===0} />
  }

  const isDesktop = useMediaQuery({query: "(min-width: 768px) and (pointer: fine)"});

  return (
    <div id="scroll-div" className={`w-full max-h-[100%] overflow-y-scroll ${!isDesktop && !noPad ? "pb-[10vh]" : ""} ${!noPad ? "pt-[10vh]" : ""}`}>
      <InfiniteScroll
        hasMore={hasMore}
        dataLength={writeUps}
        next={loadMore}
        scrollableTarget="scroll-div"
        loader={<Skeletons size={10} />}
      >
        {writeUps.length ? writeUps.map((writeup, i)=> renderItem(writeup, i)) : null}
      </InfiniteScroll>
      </div>
  )
}



// fetch write ups and return write ups list
export const WriteUpsFeed = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextPage, setNextPage] = useState(null);


  const { toast } = useToast();


  const loadMore = async () => {

    setLoading(true);

    const response = await fetch(nextPage ? nextPage : API_URL+`writeup/list?page_size=5&page=1`);

    const data = await response.json();


    if(!response.ok)
    {
      setLoading(false);
      setHasMore(false);
      toast({
        title: "something went wrong!",
        description: "please refresh the page."
      });
    }

    else{
      if(nextPage)
      {
        setItems(p=>[...p, ...data.results]);
      }
      else{
        setItems(data.results);
      }

      if(!data.next)
      {
        setHasMore(false);
        setNextPage(null);
      }
      else{
        setNextPage(data.next);
      }

      setLoading(false);
    }

  } 


  useEffect(()=> {
    if(!items.length && !loading && hasMore)
    {
      loadMore();
    }
  }, [!items, !loading, hasMore])


  return (
    <WriteUpList 
      writeUps={items} 
      hasMore={hasMore}
      loadMore={loadMore}
      loading={loading}
    />
  )

}

