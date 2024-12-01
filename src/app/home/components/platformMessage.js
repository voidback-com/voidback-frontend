'use client'

import { useState } from "react";
import { HStack, Spacer } from "@chakra-ui/react";
import { useDisclosure, Image, ModalContent, Modal, ModalHeader, ModalBody, ModalFooter, Button, Link } from "@nextui-org/react";
import { XCircle } from "@geist-ui/icons";



const PlatformMessage = ({message}) => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [close, setClose] = useState(false);


  const hdate = require("human-date");


  const renderLinks = (links) => {
    return( 
      <HStack
        width={"fit-content"}
        gap={4}
      >
        {
          links.map((link)=> {
            return <Link href={link.link} isExternal={!link.isInternal}>{link.label}</Link>
          })
        }
      </HStack>
    )
  }

  console.log(message);

  if(message)
  {

    if(!isOpen && !close)
      onOpen()

    if(close)
      return null


    return (
       <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange} closeButton={
       <Button className="w-fit h-fit shadow-none" variant="light" onPress={()=>{setClose(true)}}>
         <XCircle size={20} />
       </Button>
       }>
        <ModalContent className="bg-background border-1">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{message.title}</ModalHeader>
              <ModalBody className="flex flex-col gap-8">
                {message.image ? <Image 
                  src={message.image} 
                  className="w-1/2 h-1/2 rounded-md place-self-center" 
                /> :null}
                <p> 
                  {message.description}
                </p>
              </ModalBody>

              <ModalFooter>
                <HStack width={"100%"}>
                  <p className="font-bold text-sm">{hdate.relativeTime(message.created_at)}</p>
                  <Spacer />

                  {message.links && renderLinks(message.links)}
  
                </HStack>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
  }


}


export default PlatformMessage;
