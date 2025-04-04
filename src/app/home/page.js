'use client'
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Skeleton, Spinner } from "@nextui-org/react";
import { HStack, VStack, Wrap, Spacer, Text } from "@chakra-ui/react";
import { Topbar } from "./components/topbar";
import TagsFilterBar from "./components/tagsFilterBar";
import { LeftFeedContext } from "../providers/FeedsProvider/LeftFeedProvider";
import { WriteUpCard } from "./components/WriteUpCard";
import InfiniteScroll from "react-infinite-scroller";




const Home = () => {


  document.title = "Home";


  const { getWriteUps } = useContext(LeftFeedContext);


  const [tags, setTags] = useState(null);
  const [selectedTag, setSelectedTag] = useState("All");


  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [writeups, setWriteups] = useState([]);
  const [end, setEnd] = useState(false);


  const fetchWriteUps = async () => {

    if(loading || end) return;

    setLoading(true);

    let filterTag = selectedTag;
    if(filterTag==="All")
      filterTag=null;

    const response = await getWriteUps(page, filterTag);

    const data = await response.json();

    if(response.status===200)
    {
      if(page>1)
        setWriteups(p=>[...p, ...data.results]);
      else
        setWriteups(data.results);

      if(!data.next)
      {
        setEnd(true);
      }
      else{
        setPage(page+1);
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
    setEnd(false);
    setWriteups([]);
  }



  const vref = useRef();


  return (
    <VStack
      maxHeight={"100vh"}
      width="100%"
      bg={"default"}
      className="bg-background h-full flex flex-col"
      spacing={0}
    >
      <div className="w-full">
        <Topbar setSelected={setSelectedTag} fetchWriteUps={fetchWriteUps} setEnd={setEnd} setPage={setPage} setWriteUps={setWriteups} />

        <TagsFilterBar tags={tags} setTags={setTags} selectedTag={selectedTag} selectTag={handleSelectTag} />
      </div>

      <div 
        className="w-full h-full overflow-y-scroll"
        ref={(r)=>vref.current=r}
      >
        <InfiniteScroll
          className="py-[10vh] gap-6 flex flex-wrap justify-start gap-y-10 p-8"
          initialLoad
          hasMore={!end}
          loadMore={()=>fetchWriteUps()}
          data={writeups}
          loader={
            <HStack
              minWidth={"100%"}
              padding={"2%"}
              paddingBottom={"10%"}
            >
              <Spacer />
              <Spinner color="default" size="md" />
              <Spacer/>
            </HStack>
          }
          threshold={400}
          useWindow={false}
          getScrollParent={()=>vref.current}
        >
          { 
            writeups.length ?
            writeups.map((w)=> {
              return (
                <WriteUpCard key={w.id} writeup={w} />
              )
            })

            : !loading && <Text fontSize={"small"}>no write ups found.</Text>
          }
        </InfiniteScroll>
      </div>

    </VStack>
  )

  }


export default Home;

