'use client'
import { 
  useState,
  useContext,
  useEffect,
} from "react";
import { 
  VStack,
  Spacer,
  HStack,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SkeletonText,
  Link,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  CloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import {EditorContext} from "@/app/providers/FeedsProvider/PostEditorProvider";
import PostOption from "./components/toolbarComponents/PostOption";
import ImageOption from "./components/toolbarComponents/ImageOption";
import Editor from "./components/editor";
import CharLimit from "./components/toolbarComponents/charLimit";
import { MediaSection } from "../view/post/components/MediaSection";



const VoidBackEditor = ({isOpen, onClose, onOpen}) => {



  const [content, setContent] = useState(null);
  const [attributes, setAttributes] = useState(null);
  const [text, setText] = useState(null);

  const { 
    postError, 
    postLoading, 
    postSuccess,
    lastPostId,
  } = useContext(EditorContext);
 




  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);


  useEffect(()=> {
    if(postError)
      setErrorOpen(true);
  }, [postError])


  useEffect(()=> {
    if(postSuccess)
      setSuccessOpen(true);
  },[postSuccess])



  return (
    <Drawer
      isOpen={isOpen} 
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom"
      isFullHeight
    >
      <DrawerOverlay />
      <DrawerContent width="100%" height={"100%"} background={"default"} className="bg-background" overflowY={"scroll"}>

      <DrawerHeader width={"100%"}>
        <HStack width={"100%"}>
        <Spacer />
        <CloseButton onClick={onClose} />
        </HStack>
      </DrawerHeader>

      <DrawerBody overscrollY={"scroll"} width="90%" height={"100%"} alignSelf={"center"} padding={0}>
        <VStack
          maxHeight={"100%"}
          minHeight={"100%"}
          padding={"2%"}
          direction="column"
          overflowY={"scroll"}
        >
{
              errorOpen 
                &&
              <Alert 
                  alignSelf={"center"}
                  status="error" 
                  width={"fit-content"}
                  borderRadius="3px"
                  padding={"2%"}
                  height={"fit-content"}
                >
                <AlertIcon boxSize={"5%"} />
                <Spacer/>

                <HStack>
                  <AlertTitle fontWeight={"600"}>Post Error:</AlertTitle>

                  <AlertDescription>
                    {postError}
                  </AlertDescription>
                </HStack>

                <Spacer/>

                <CloseButton
                  onClick={()=>setErrorOpen(!errorOpen)}
                />

              </Alert>
            }

            {
              successOpen
                &&
                <Alert 
                    alignSelf={"center"}
                    status="success" 
                    width={"fit-content"}
                    borderRadius="3px"
                    padding={"2%"}
                    height={"fit-content"}
                  >
                  <AlertIcon boxSize={"5%"} />
                  <Spacer/>

                  <HStack>
                    <AlertTitle fontWeight={"600"}>Post:</AlertTitle>

                    <AlertDescription>
                      <Link href={`/view/post/${lastPostId}`}>view your post</Link>
                    </AlertDescription>
                  </HStack>

                  <Spacer/>

                  <CloseButton
                    onClick={()=>setSuccessOpen(!successOpen)}
                  />

                </Alert>
            }



            <Skeleton className="p-4" isLoaded={!postLoading}>
              { image || video ?
              <MediaSection  setVideo={setVideo} video={video} image={image} setImage={setImage} edit_mode />
                : null
              }
            </Skeleton>


            
            <SkeletonText style={{scrollbarWidth: "none"}} isLoaded={!postLoading}>
              <div className="w-[50vw] max-w-[600px] items-center flex flex-col border-0 rounded-md">
                <Editor setContent={setContent} setAttributes={setAttributes} setText={setText} />

                <div className="w-full flex flex-row p-2 border-1 h-fit rounded-lg">

                  <div className="flex flex-row gap-4">
                    <ImageOption image={image} setImage={setImage} />
                    <CharLimit text={text} />
                  </div>

                  <Spacer/>

                  <PostOption video={video} image={image} content={content} attributes={attributes} text={text} parent_post={null} />
                </div>

              </div>

            </SkeletonText>
          </VStack>
        </DrawerBody>

            {/* modern looking toolbar */}

      </DrawerContent>
    </Drawer>

  )
}



export default VoidBackEditor;

