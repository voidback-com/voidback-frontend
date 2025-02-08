import { VStack, HStack } from "@chakra-ui/react";
import { Image } from "@nextui-org/react";
import { Touchable } from "../auth/components";



export const MediaSection = ({video, image, setImage, edit_mode=false, small=false}) => {



  if(image)
  {

     return(
      <VStack className="h-fit">
        {
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

            <HStack className="w-full flex flex-row justify-center">
              <Image 
                src={image.source}
                className="rounded-md border-1"
                alt="post-image"
                contentFit="contain"
              />
            </HStack>
          </VStack>


       : 
          small
              ?
            <HStack className="w-fit flex flex-row justify-center pb-2">
              <Image 
                src={image.source}
                size="xl"
                className="rounded-md border-1"
                alt="dm-image"
                contentFit="contain"
              />
            </HStack>
              :
        /* remote image stack  */
          <HStack className="w-full flex flex-row justify-center pb-10 py-5">
           
            <Touchable
              className="w-fit h-fit"
              activeOpacity={1}
              >
                <Image 
                  source={image.image}
                  size="xl"
                  className="rounded-md aspect-[1/1] w-full h-fit border-10"
                  alt="dm-image"
                  contentFit="cover"
                  transition={1000}
                />
            </Touchable>

          </HStack>


        }

      </VStack>
    )
  }

}



