'use client'
import { useFileUpload } from 'use-file-upload';
import { Button } from "@nextui-org/react";
import { Image } from '@geist-ui/icons';
import { useEffect } from "react";



const ImageOption = ({setImage, image}) => {
  const [selectedImage, selectImage] = useFileUpload();


  useEffect(()=> {
    setImage(selectedImage);
  }, [selectedImage])


  return (
    <Button
      variant="bordered"
      isIconOnly
      onClick={()=>{
      selectImage({"accept": "image/*", multiple: false})
    }}>
      <Image size={24} />
    </Button>
  )
}


export default ImageOption;
