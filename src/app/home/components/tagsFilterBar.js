'use client'
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { HStack, Text, Spacer, Spinner } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Button, Card, CardBody } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "@geist-ui/icons";


const Tag = ({tag, selectTag, selectedTag}) => {

  const fmt = require("human-readable-numbers");


  return (
    <Card isPressable onPress={()=>selectTag(tag.tag)} className={`h-fit w-fit shadow-none rounded-xl border-1 p-0 ${selectedTag===tag.tag && "bg-default-200"}`}>
      <CardBody>
        <Text className="text-sm font-semibold" fontFamily={"sans-serif"}>
          {tag.tag}
        </Text>
      </CardBody>
    </Card>
  )
}



const TagsFilterBar = ({tags, setTags, selectTag, selectedTag}) => {

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(true);
  const [prev, setPrev] = useState(false);


  const { getTags, isMobile } = useContext(LeftFeedContext);


  const fetchPage = async () => {
    setLoading(true);

    const response = await getTags(page+1, isMobile ? 1 : 5);

    const data = await response.json();

    if(response.status===200)
    {
      setTags(data.results);

      if(data.next)
      {
        setPage(page+1);
        setNext(true);
      } else {
        setNext(false)
      }


      if(data.previous)
      {
        setPrev(true);
      } else {
        setPrev(false);
      }

    }

    setLoading(false);
  }


  useEffect(()=> {
    if(!page && !loading && !tags)
    {
      fetchPage();
    }
  }, [!loading, !tags])


  const previous = async () => {
    if(prev)
    {
      setLoading(true);

      const response = await getTags(page, isMobile ? 1 : 5);

      const data = await response.json();

      if(response.status===200)
      {
        setPage(page-1);

        setTags(data.results);

        if(data.next)
        {
          setNext(true);
        } else {
          setNext(false)
        }


        if(data.previous)
        {
          setPrev(true);
        } else {
          setPrev(false);
        }

      }

      setLoading(false);
    }
  }


  return (
    <HStack className="h-fit w-full p-3 border-b-1">
      <Button
        variant="bordered"
        size="sm"
        className="border-1"
        isDisabled={!prev}
        onPress={()=>previous()}
      >
        <ChevronLeft />
      </Button>

      <Spacer />
      <div
        className="w-full flex flex-row gap-5"
      >
        <Tag tag={{"tag": "All"}} selectTag={selectTag} selectedTag={selectedTag} />
        {
          tags && tags.map((t,i)=> {
            return <Tag key={i} tag={t} selectTag={selectTag} selectedTag={selectedTag} />
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
        isDisabled={!next}
        onPress={()=>fetchPage()}
      >
        <ChevronRight />
      </Button>


    </HStack>
  )
}


export default TagsFilterBar;

