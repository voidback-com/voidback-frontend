import React, { useContext, useEffect, useState, useRef } from "react";
import { Badge, HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import { SessionScreenHeader } from "./SessionScreenHeader";
import { SessionEditor } from "./dmEditor";
import { DirectMessageContext } from "@/app/providers/DirectMessageProvider";
import { Spinner } from "@nextui-org/react";
import InfiniteScroll from "react-infinite-scroller";
import { DMMessage } from "../dmMessageCard";



export const DmScreen = ({messageStr}) => {

  const { viewSession } = useContext(DirectMessageContext);

  const [message, setMessage] = useState(JSON.parse(messageStr));

  const [messages, setMessages] = useState([]); // messages from this conversation e.g. DMSession

  const [page, setPage] = useState(1);
  const [end, setEnd] = useState(false);
  const [loading, setLoading] = useState(false);



  const fetchMessages = async () => {
    if(!message || loading) return;

    setLoading(true);

    const page = Math.floor(messages.length > 0 ? (messages.length/15)+1 : 1);

    const response = await viewSession(message.session.id, page);

    const data = await response.json();

    if(response.status==200)
    {
      if(messages.length)
        setMessages(prev=>[...prev, ...data.results]);
      else{
        setMessages(data.results);
      }

      if(!data.next)
        setEnd(true);

      else{
        setPage(p=>p+1);
      }
    }

    setLoading(false);
  }






  if(!messageStr)
  {
    return (
      <VStack className="ml-10 w-full h-full p-2 place-self-center border-1 rounded-lg relative right-5 justify-center"
        >
        <Badge variant="outline" className="p-2" size={"lg"}>
            pick a conversation
        </Badge>
        </VStack>
    )
  }



  const vref = useRef(null);

  useEffect(()=> {

    if(vref.current)
    {
      vref.current.scrollTop = vref.current.scrollHeight+10;
    }

  }, [messages])


  useEffect(()=> {
    if(vref.current)
    {
      vref.current.scrollToBottom = "smooth";
    }
  }, [messages])


  return (
    <VStack
      gap={0}
      className="ml-10 w-full h-full place-self-center border-1 rounded-lg relative right-5 gap-0"
    >
      <SessionScreenHeader message={message} />

      <VStack
        ref={vref}
        style={{
            padding: 10,
            scrollbarWidth: "none", 
            width: "100%",
            overflowY: "auto",
            height: "100%",
          }}
      >
        <InfiniteScroll
        style={{
          width: "100%"
          }}
        getScrollParent={()=>vref.current}
        isReverse
        pageStart={0}
        loadMore={fetchMessages}
        data={messages}
        hasMore={!end}
        initialLoad
        loader={
        <HStack
          width="100%"
          padding={"2%"}
          paddingBottom={"10%"}
        >
          <Spacer/>
          <Spinner size="md" color="default" />
          <Spacer/>
        </HStack>
        }
        >
          {messages && messages.slice().reverse().map((dm)=> {
           return <DMMessage setMessages={setMessages} message={dm} key={dm.id} />; 
          })}
        </InfiniteScroll>
      </VStack>

      <SessionEditor sessionId={message?.session?.id} setMessages={setMessages} />
    </VStack>
  )
}
