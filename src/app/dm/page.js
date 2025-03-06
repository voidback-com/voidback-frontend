'use client'
import { useState, useContext, useEffect } from "react";
import { Container, Show } from "@chakra-ui/react";
import { SessionsList } from "./components/SessionList";
import { LeftSection } from "../home/components/Sections";
import { DmScreen } from "./components/DmScreen";
import { DirectMessageContext } from "../providers/DirectMessageProvider";



const Page = () => {

  const [messages, setMessages] = useState([]);

  const [selected, setSelected] = useState(null);

  const { getSessions } = useContext(DirectMessageContext);

  const [loading, setLoading] = useState(false);


  const fetchSessions = async () => {
    setLoading(true);
    const response = await getSessions();

    const data = await response.json();

    if(response.status===200)
    {
      setMessages(data);
    }

    setLoading(false);
  }

  useEffect(()=> {
    fetchSessions();
  }, [!messages.length])

  document.title = "DMs";


  return (
    <Container 
      minW={"100%"} 
      overflow={"hidden"} 
      height="100vh" 
      padding={2}
      className="bg-background flex flex-row"
    >
      {
        selected
          ?
        <Show breakpoint="(min-width: 1000px)">
          <SessionsList setSelected={setSelected} selected={selected} messages={messages} setMessages={setMessages} />
        </Show>
      :

        <SessionsList setSelected={setSelected} selected={selected} messages={messages} setMessages={setMessages} loading={loading} />
      }

      {
        selected
          ?
        <DmScreen messageStr={selected} />
        :

        <Show breakpoint="(min-width: 1000px)">
          <DmScreen messageStr={selected} messages={messages} />
        </Show>
      }
    </Container>
  )
}



export default Page;
