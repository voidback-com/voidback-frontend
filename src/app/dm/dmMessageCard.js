'use client'
import { 
  Container, 
  Box,
  VStack,
  Input,
  useColorMode,
  Spacer,
  Stack,
  HStack,
  Text,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { useContext, useState, useEffect, useRef } from "react";
import { Button, Divider, Spinner } from "@nextui-org/react";
import { AuthContext } from "../providers/AuthProvider";
import { MediaSection } from "../globalComponents/mediaViewer";
import { Touchable } from "../auth/components";
import { RotateCw } from "@geist-ui/icons";



export const DeliveringDMMessageCard = ({message}) => {


  const { account } = useContext(AuthContext);


  const hdate = require("human-date");

  if(!account)
  {
    return (
      <Spinner size="small" />
    )
  }


  return (
    <VStack className="gap-2 items-around w-full p-4">
      <Box className={`self-end h-fit border-[1px] border-default-50 p-4 rounded-[25px] max-w-[70%] rounded-br-none`}>
        <VStack
          className="w-fit h-fit"
        >
          {
            message.image
            ?
              <MediaSection image={message.image} edit_mode />
            :
            null
          }
          <Text size="md" className="w-fit max-w-[30vw]">
            {message.message}
          </Text>
      </VStack>
      </Box>

      <HStack className={`self-end flex flex-row justify-end h-fit gap-1 my-1`}>
        {message.failed && <Text size="sm">Message failed</Text>}
        {!message.failed
          ?
        <Spinner size={"sm"} color="default" />
            :
          <Touchable onPress={()=>message.retry(message.id)}>
            <RotateCw color={"tomato"} size={18} />
          </Touchable>
        }
      </HStack>

    </VStack>
  )
}


export const DMMessage = ({message}) => {

  const { account } = useContext(AuthContext);


  const hdate = require("human-date");



  if("local" in message)
  {
    return <DeliveringDMMessageCard message={message} />
  }

  if(!account)
  {
    return (
      <Spinner size="small" />
    )
  }


  return (

    <VStack className="gap-2 items-around h-fit w-full p-4">
      <Box className={`${message.sender.username===account.username ? "self-end" : "self-start"} h-fit border-[1px] border-primary-50 p-4 rounded-[25px] ${message.sender.username===account.username ? "rounded-br-none bg-secondary-100 border-secondary-0" : "rounded-bl-none bg-secondary-300 border-secondary-50"} max-w-[80%]`}>

          {
            message.image
            ?
              <MediaSection image={message.image} small />
            :
            null
          }
          <VStack
            className="w-fit h-fit"
          >
          {
            message.message
            ?
            <Text 
              size="md" 
              className="w-fit max-w-[100%]"
            >
              {message.message}
            </Text>

            :
              null
          }


        </VStack>
      </Box>

      <HStack className={`${message.sender.username===account.username ? "self-end flex flex-row justify-end" : "mx-1"} h-fit gap-1`}>
        <Text
          size="2xs"
          className="font-semibold"
        >
          {message.sender.username==account.username ? message.seen ? "seen" : "sent" : "received"}
        </Text>
        <Text
          size="2xs"
          className="font-semibold"
        >
          {message.sender.username==account.username ? message.seen ? hdate.relativeTime(message.seen_at) : hdate.relativeTime(message.sent_at) : hdate.relativeTime(message.sent_at)}
        </Text>
      </HStack>

    </VStack>
  )
}

