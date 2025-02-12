import { VStack, HStack } from "@chakra-ui/react";
import { Image } from "@nextui-org/react";
import { Touchable } from "../auth/components";



export const MediaSection = ({video, image, setImage, edit_mode=false, toRight, small=false}) => {



  if(image)
  {

     return(
          edit_mode ?

          /* image stack  */
          <VStack className="h-fit py-5">
              { setImage
                ?
            <HStack className="w-full flex flex-row justify-end max-w-[80%]">
                <Touchable onPress={()=>setImage(null)}>
                  <X size={20} color={"tomato"} />
                </Touchable>
            </HStack>
            :
                null
              }

            <HStack className="w-full flex flex-row justify-end">
              <Image 
                src={image.source}
                className="rounded-md w-[50%] h-fit"
                alt="post-image"
                contentFit="contain"
              />
            </HStack>
          </VStack>


       : 
        /* remote image stack  */
        <HStack
          className={`w-full flex flex-row ${toRight ? "justify-end" : "justify-start"}`}
        >
            <Image 
              src={image.image}
              removeWrapper
              className="rounded-md w-[50%] h-fit"
              alt="dm-image"
              contentFit="cover"
              transition={1000}
            />
          </HStack>


    )
  }

}



