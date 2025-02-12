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
import { Button, Divider, Spinner, PopoverContent, Popover, PopoverTrigger } from "@nextui-org/react";
import { AuthContext } from "../providers/AuthProvider";
import { MediaSection } from "../globalComponents/mediaViewer";
import { Touchable } from "../auth/components";
import { RotateCw, Trash } from "@geist-ui/icons";
import { DirectMessageContext } from "../providers/DirectMessageProvider";



export const DeliveringDMMessageCard = ({message}) => {


  const { account } = useContext(AuthContext);




  if(!account)
  {
    return (
      <Spinner size="small" />
    )
  }


  return (
    <VStack className="gap-2 items-around w-full p-4">

      {
        message.image
        ?
          <MediaSection image={message.image} edit_mode />
        :
        null
      }


      <Box className={`self-end h-fit border-[1px] border-default-50 p-4 rounded-[25px] max-w-[70%] rounded-br-none`}>
          <Text size="md" className="w-fit max-w-[30vw]">
            {message.message}
          </Text>
      </Box>

      <HStack className={`self-end flex flex-row justify-end h-fit gap-1 my-1 p-0`}>

        {!message.failed
          ?
        <Spinner size={"sm"} color="default" />
            :
          <Touchable variant="light" onPress={()=>message.retry(message.id)}>
          <Text size="sm">try again...</Text>
            <RotateCw color={"tomato"} size={18} />

          </Touchable>
        }
      </HStack>

    </VStack>
  )
}


export const DMMessage = ({message, setMessages}) => {

  const { account } = useContext(AuthContext);

  const { deleteDM } = useContext(DirectMessageContext);

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


  const handleDelete = async () => {

    const response = await deleteDM(message.id);

    if(response.status===200)
    {
      setMessages(p=>p.filter((x)=> x.id!==message.id));
    }

  }


  return (
    <VStack className="gap-2 items-around h-fit w-full p-2">

      {
        message.image
        ?
          <MediaSection image={message.image} toRight={message.sender.username===account.username} />
        :
        null
      }


      {
        message.sender.username===account.username
        ?
        <Popover placement="bottom" showArrow>
          <PopoverTrigger>
            <Box className={`${message.sender.username===account.username ? "self-end" : "self-start"} h-fit border-[1px] border-primary-50 p-3 rounded-[25px] ${message.sender.username===account.username ? "rounded-br-none bg-primary-400 border-secondary-0" : "rounded-bl-none bg-default-50 border-secondary-50"} max-w-[75%]`}>
                {
                  message.message
                  ?
                  <Text 
                    size="md" 
                    className="max-w-[30vw]"
                    wordBreak={"break-word"}
                  >
                    {message.message}
                  </Text>

                  :
                    null
                }
            </Box>
          </PopoverTrigger>

          <PopoverContent className="w-full h-full">
            <VStack className="w-full flex flex-col justify-center">
              <Button onPress={handleDelete} size="sm" variant="light">
                <Trash color="tomato" />
              </Button>
            </VStack>
          </PopoverContent>
        </Popover>
        :
    <Box className={`${message.sender.username===account.username ? "self-end" : "self-start"} h-fit border-[1px] border-primary-50 p-3 rounded-[25px] ${message.sender.username===account.username ? "rounded-br-none bg-primary-400 border-secondary-0" : "rounded-bl-none bg-default-50 border-secondary-50"} max-w-[75%]`}>
                {
                  message.message
                  ?
                  <Text 
                    size="md" 
                    className="w-fit max-w-[30vw]"
                  >
                    {message.message}
                  </Text>

                  :
                    null
                }
        </Box>
      }

      <HStack className={`${message.sender.username===account.username ? "self-end flex flex-row justify-end" : "mx-1"} h-fit gap-1 w-full p-1`}>
        <Text
          fontSize={"x-small"}
          className="font-semibold"
        >
          {message.sender.username==account.username ? message.seen ? "seen" : "sent" : "received"}
        </Text>
        <Text
          fontSize={"x-small"}
          className="font-semibold"
        >
          {message.sender.username==account.username ? message.seen ? hdate.relativeTime(message.seen_at) : hdate.relativeTime(message.sent_at) : hdate.relativeTime(message.sent_at)}
        </Text>
      </HStack>

    </VStack>
  )
}

