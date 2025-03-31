'use client'
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Skeleton } from "@nextui-org/react";
import { VStack, Wrap } from "@chakra-ui/react";
import { Topbar } from "./components/topbar";
import TagsFilterBar from "./components/tagsFilterBar";
import { LeftFeedContext } from "../providers/FeedsProvider/LeftFeedProvider";
import { WriteUpCard } from "./components/WriteUpCard";




const Home = () => {

  document.title = "Home";

  const { account } = useContext(AuthContext);

  const { getWriteUps } = useContext(LeftFeedContext);


  const [tags, setTags] = useState(null);
  const [selectedTag, setSelectedTag] = useState("All");

  const router = useRouter();


  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [writeups, setWriteups] = useState([]);
  const [end, setEnd] = useState(false);


  const fetchWriteUps = async () => {
    setLoading(true);

    let filterTag = selectedTag;
    if(filterTag==="All")
      filterTag=null;

    const response = await getWriteUps(page, filterTag);

    const data = await response.json();

    if(response.status===200)
    {
      setWriteups(data.results);

      if(!data.next)
      {
        setEnd(true);
      }
    }
    else{
      setEnd(true);
    }

    setLoading(false);

  }


  const handleSelectTag = (t) => {
    setSelectedTag(t);
    setPage(1);
    fetchWriteUps();
  }


  const previous = () => {
    if(page > 1)
    {
      setPage(page-1);
      fetchWriteUps();
    }
  }


  useEffect(()=> {
    if(!end && !loading && page===1 && !writeups.length)
    {
      fetchWriteUps();
    }
  }, [!end, !loading])


  return (
    <VStack
      height={"100vh"}
      width="100%"
      bg={"default"}
      className="bg-background flex flex-col"
      overflow={"hidden"}
      overflowY="hidden"
      spacing={0}
    >
      <Topbar />

      <TagsFilterBar tags={tags} setTags={setTags} selectedTag={selectedTag} selectTag={handleSelectTag} />

      <div
        className="w-full h-full p-5 overflow-y-scroll gap-5 flex flex-wrap justify-center gap-y-10"
      >
        {
          writeups.length
          ?
            writeups.map((writeup)=> {
              return <WriteUpCard writeup={writeup} />
            })
          :
          null
        }
      </div>

    </VStack>
  )

  }


export default Home;

