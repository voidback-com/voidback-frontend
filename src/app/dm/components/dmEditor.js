import { HStack, VStack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Image, Input, Button, Textarea } from "@nextui-org/react";
import { Image as ImageIcon, Send, Trash } from "@geist-ui/icons";
import { ArrowUp } from '@geist-ui/icons';
import { useFileUpload } from 'use-file-upload';
import { DirectMessageContext } from "@/app/providers/DirectMessageProvider";



export const SessionEditor = ({sessionId, setMessages}) => {

  const [text, setText] = useState("");
  const [selectedImage, selectImage] = useFileUpload();
  const [imageObj, setImageObj] = useState(null);
  const [post, setPost] = useState(null);
  const [locked, setLocked] = useState(false);


  useEffect(()=> {
    if(imageObj===null && selectedImage)
    {
      setImageObj(selectedImage);
    }
  }, [!imageObj, selectedImage])



  const { sendDM } = useContext(DirectMessageContext);


  const sendMessage = async (tempid) => {

    if(!tempid)
    {
      tempid = new Date().getMilliseconds();
      setMessages(p=>[{message: text, post, image: imageObj, local: true, id: tempid, failed: false, retry: sendMessage}, ...p]);
    }

    setLocked(true);

    const response = await sendDM(sessionId, text, post, imageObj);

    const data = await response.json();

    if(response.status===200)
    {

      setText("");
      setPost(null);
      setImageObj(null);
      setLocked(false);

      setMessages(p=>p.filter((x)=> x.id!==tempid));
      setMessages(p=>[data, ...p]);
    } else {
      setMessages(p=>p.filter((x)=> x.id!==tempid));
      setMessages(p=>[{message: text, post, image: imageObj, local: true, id: tempid, failed: true}, ...p]);
      setLocked(false);
    }

  }


  return (
    <HStack
      className="w-full max-h-full border-t-1 p-2 z-100"
    >

      <VStack className="w-fit flex flex-col h-full justify-end">
        <button
          className="border-0 p-1"
          onClick={()=>{
            setImageObj(null);
            selectImage({"accept": "image/*", multiple: false})
          }}
        >
          <ImageIcon />
        </button>
      </VStack>

      <VStack className="w-full max-h-[10vh] min-h-fit">
        {
          imageObj
          ?
            <VStack>
              <HStack className="w-full flex flex-row justify-end p-5">
                <button onClick={()=>setImageObj(false)}>
                  <Trash color="tomato" />
                </button>
              </HStack>
              <Image 
                src={imageObj.source}
                className="w-[100%] h-[100%] max-h-[30vh]"
                style={{position: "relative", bottom: 10}}
              />
            </VStack>
          :
          null
        }
        <Textarea
          isDisabled={locked}
          className="max-w-full"
          variant="solid"
          placeholder="message..."
          value={text}
          onValueChange={setText}
        />
      </VStack>

      <VStack
        className="h-full flex flex-col justify-end"
      >
        <button
          className="border-1 rounded-full p-1 hover:bg-default-50"
          onClick={()=>sendMessage(null)}
        >
          <ArrowUp size={25} />
        </button>
      </VStack>
    </HStack>
  )
}
