'use client'

import { useEffect, useState } from "react";
import { getAccountWriteUps } from "../helpers/Profile";
import { WriteUpList } from "../writeUpList";


export const ProfileWriteUps = ({username})=> {

  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [end, setEnd] = useState(false);



  const loadMore = async () => {

    if(loading) return;

    setLoading(true);

    const data = await getAccountWriteUps(username, nextPage);


    if(data.ok)
    {
      const { results, next } = await data.json();


      if(writeups.length && results.length)
        setWriteups(p=>[...p, ...results]);

      else if(results.length && !writeups.length)
      {
        setWriteups(results);
      }

      else{
        setEnd(true);
      }


      if(!next)
        setEnd(true);

      setNextPage(next);
    }


    setLoading(false);
  }



  useEffect(()=> {
    if(!end && !writeups.length && !loading)
      loadMore();
  }, [!end, !writeups.length, !loading])


  return (
      <WriteUpList 
        loadMore={loadMore}
        loading={loading}
        hasMore={!end}
        writeUps={writeups}
        noPad
      />
  )
}
