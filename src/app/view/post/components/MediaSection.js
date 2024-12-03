import { Touchable } from "@/app/auth/components";
import { 
  Container,
  HStack,
  Spacer,
  Tabs,
  TabPanels,
  TabPanel,
  Stack,
  Button,
  useDisclosure,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  VStack
} from "@chakra-ui/react";
import { Image } from "@nextui-org/react";
import { MdCancel } from "@react-icons/all-files/md/MdCancel";
import ReactPlayer from "react-player/youtube";
import { PlayFill } from '@geist-ui/icons';




const VideoPlayer = ({url}) => {

  return (
    <ReactPlayer 
      url={url} 
      height={300}
      className={`border-1 rounded-md bg-background`}
      playIcon={<PlayFill size={20} />}
      controls
    />
  )
}


export const MediaSection = ({video, image, setVideo, setImage, edit_mode=false}) => {

  const imgDrawer = useDisclosure();



  if(image)
  {

     return(
      <Container className="w-full py-4">
        {
          edit_mode ?

          /* image stack  */
          <VStack>
            <HStack width={"100%"} className="flex flex-row justify-end">
                <Touchable onClick={()=>setImage(null)}>
                  <MdCancel color="tomato" size={20} />
                </Touchable>
            </HStack>
            <HStack width={"100%"} className="flex flex-row justify-center">
              <Image 
                onClick={imgDrawer.onOpen}
                src={image.source} 
                className="object-contain p-0 max-w-full max-h-[250px]"
              />
            </HStack>
          </VStack>


       : 
        /* remote image stack  */
          <HStack width={"100%"} className="flex flex-row justify-center">
            <Image 
              onClick={imgDrawer.onOpen}
              src={image.image} 
              className="object-contain p-0 max-w-full max-h-[250px]"
            />
          </HStack>
        }



        <Drawer
          isOpen={imgDrawer.isOpen}
          onClose={imgDrawer.onClose}
          size="full"
        >
          <DrawerOverlay />
          <DrawerContent
            width="100%"
            height="100%"
            alginContent="center"
            padding="4%"
            background={"default"}
            className="bg-background h-full w-dull"
            overflow={"scroll"}
          >
            <DrawerCloseButton />
            <HStack className="w-full h-full bg-background" paddingTop={20}>
              <Spacer/>
            {
              edit_mode ?
               <Image 
                src={image.source} 
                className="z-0 w-[100%] max-w-[70vw]"
              />

              :
               <Image 
                src={imgDrawer.isOpen && image.image} 
                className="z-0 w-[100%] max-w-[70vw]"
              />
            }
              <Spacer/>
            </HStack>
          </DrawerContent>
        </Drawer>
      </Container>
    )
  }


  else if(video)
  {

     return(
      <Container className="w-full py-4">
        {
          edit_mode ?

          /* vid stack  */
          <HStack width={"100%"} className="flex flex-row justify-center">
            <VideoPlayer 
              url={video} 
            />
          </HStack>


       : 
        /* remote vid stack  */
          <HStack width={"100%"} className="flex flex-row justify-center">
            <VideoPlayer 
              url={video} 
            />
          </HStack>
        }

      </Container>
    )
  }
}


