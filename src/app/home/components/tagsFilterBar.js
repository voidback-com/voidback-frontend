'use client'
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { HStack, Text, Spacer, Spinner } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Button, Chip } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "@geist-ui/icons";


const Tag = ({tag, selectTag, selectedTag}) => {

  const fmt = require("human-readable-numbers");


  return (
    <Chip onClick={()=>selectTag(tag.tag)} size="sm" variant="bordered" className={`h-full rounded-xl border-1 p-2 ${selectedTag===tag.tag && "bg-default-50"}`}>
      <Text className="text-sm font-semibold" fontFamily={"sans-serif"}>
        {tag.tag}
      </Text>
    </Chip>
  )
}



const TagsFilterBar = ({tags, setTags, selectTag, selectedTag}) => {

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);


  const { getTags } = useContext(LeftFeedContext);


  const fetchPage = async () => {
    setLoading(true);

    const response = await getTags(page);

    const data = await response.json();

    if(response.status===200)
    {
      setTags(data.results);

      if(data.next)
      {
        setPage(p=>p+1);
      } else {
        setEnd(true);
      }
    }

    setLoading(false);
  }


  useEffect(()=> {
    if(page===1 && !loading && !tags)
    {
      fetchPage();
    }
  }, [!loading, !tags])


  const previous = () => {
    if(page > 1)
    {
      setPage(p=>p-1);
      fetchPage();
    }
  }


  return (
    <HStack className="h-fit w-full p-3 border-b-1">
      <Button
        variant="bordered"
        size="sm"
        className="border-1"
        isDisabled={page<2}
        onPress={previous}
      >
        <ChevronLeft />
      </Button>

      <Spacer />
      <div
        className="w-full flex flex-row gap-5"
      >
        <Tag tag={{"tag": "All"}} selectTag={selectTag} selectedTag={selectedTag} />
        {
          tags && tags.map((t)=> {
            return <Tag tag={t} selectTag={selectTag} selectedTag={selectedTag} />
          })
        }
        {
          loading
          ?
            <>
              <Spacer/>
              <Spinner size="md" color="default" />
              <Spacer />
            </>
          :
            null
        }
      </div>
      <Spacer />


      <Button
        variant="bordered"
        size="sm"
        className="border-1"
        isDisabled={end}
        onPress={()=>fetchPage()}
      >
        <ChevronRight />
      </Button>


    </HStack>
  )
}


export default TagsFilterBar;

