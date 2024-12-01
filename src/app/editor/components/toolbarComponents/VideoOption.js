'use client'
import { Button, Input } from "@nextui-org/react";
import { Modal, ModalHeader, ModalBody, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Video } from '@geist-ui/icons';
import { useState } from "react";



const VideoOption = ({setVideo, video}) => {
  const [text, setText] = useState('');

  const modal = useDisclosure();

  const save = () => {
    setVideo(text);
    modal.onClose();
  }


  return (
    <div className="w-full h-full">
      <Button
        variant="bordered"
        isIconOnly
        onPress={modal.onOpen}
        >
        <Video size={24} />
      </Button>


      <Modal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
      >
        <ModalOverlay />
        <ModalContent
          background={"default"}
          className="bg-background border-1 h-fit p-5 place-self-center"
        >
          <ModalBody className="flex flex-col items-center gap-5">
            <Input label="Video" aria-label="video" onChange={(e)=>setText(e.target.value)} placeholder='link to the youtube video...' size='md' />

            <Button
              size='md'
              className="w-fit justify-self-center"
              onClick={save}
            >
              save  
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

    </div>
  )
}


export default VideoOption;
