import React, { useContext, useEffect, useState } from "react";
import { Badge, HStack, Text, VStack } from "@chakra-ui/react";
import { SessionScreenHeader } from "./SessionScreenHeader";



export const DmScreen = ({messageStr, messages}) => {

  const [message, setMessage] = useState(false);


  const getMessage = () => {
    setMessage(JSON.parse(messageStr));
  }


  useEffect(()=> {
    getMessage();
  }, [messageStr])


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

  console.log("DM Screen: ", message);

  return (
    <VStack
      className="ml-10 w-full h-full p-2 place-self-center border-1 rounded-lg relative right-5"
    >
      <SessionScreenHeader message={message} />
    </VStack>
  )
}
