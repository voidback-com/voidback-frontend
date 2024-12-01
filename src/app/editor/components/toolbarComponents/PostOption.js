import React, { useContext, useEffect } from 'react';
import { AuthContext } from '@/app/providers/AuthProvider';
import { EditorContext } from '@/app/providers/FeedsProvider/PostEditorProvider';
import { Button } from '@nextui-org/react';
import { BiSend } from "@react-icons/all-files/bi/BiSend";
import { useToast } from '@chakra-ui/react';
import { isAuthenticated } from '@/app/configs/api';


const PostOption = ({content, attributes, text, image, video, parent_post}) => {


  const { 
    handlePost
  } = useContext(EditorContext);



  const toast = useToast();

  const post = () => {
    if(video)
    {
      if(!video.includes("youtube.com/watch"))
      {
        toast({
          title: "We only support youtube videos for now.",
          description: "Invalid youtube video url.",
          status: "warning",
          duration: 4000,
          isClosable: true
        })
        return;
      }
    }

    handlePost(content, text, attributes, image, video, parent_post);

  }


  const isDisabled = () => {

    if(!isAuthenticated())
      return true;

    if(text)
    {
      if(text.length < 2)
        return true;

      else{
        // check if it's not just whitespace
        if(/\S/.test(text))
          return false;
        else{
          return true;
        }
      }
    }

    else{
      return true;
    }
  }


  return (
    <Button isIconOnly onClick={post} variant='bordered' isDisabled={isDisabled()}>
      <BiSend size={24} />
    </Button>
  )
}


export default PostOption;
