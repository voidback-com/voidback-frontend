'use client'
import { 
  useState,
  useContext,
  useEffect
} from "react";
import { 
  HStack,
  Text,
  Spacer,
  Drawer,
  DrawerBody,
  DrawerContent,
  useDisclosure,
  DrawerOverlay,
  useColorMode,
  DrawerCloseButton,
  VStack,
  DrawerHeader,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Touchable } from "@/app/auth/components";
import { IoMdArrowRoundBack } from "@react-icons/all-files/io/IoMdArrowRoundBack";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { FaImage } from "@react-icons/all-files/fa/FaImage";
import {  FaPenNib } from "@react-icons/all-files/fa/FaPenNib";
import {  FaRegFilePdf } from "@react-icons/all-files/fa/FaRegFilePdf";
import { Button, Input, Progress, Skeleton, Spinner, Tooltip } from "@nextui-org/react";
import { MdLibraryBooks } from "@react-icons/all-files/md/MdLibraryBooks";
import { SidebarContext } from "@/app/providers/FeedsProvider/SidebarProvider";
import { useFileUpload } from "use-file-upload";
import { RenderMyResearch } from "./components";
import { errorToReadable, isAuthenticated } from "@/app/configs/api";
import { Search } from '@geist-ui/icons';
import checkImage from "@/app/globalComponents/imageNSFW";




export const NavBack = ({home}) => {

  const router = useRouter();

  const color = useColorMode();


  return (

      <Touchable
        onClick={()=>home?router.push("/home/foryou"):router.back()}
        className="bg-background"
        style={{
          padding: 2,
          borderRadius: 6
        }}
      >
        <IoMdArrowRoundBack size={25} />
      </Touchable>


  )
}

export const TopSection = ({searchPapers}) => {

  const { 
    getTopSearchQueries,
    getSimilarQueries,
    insertSearchQuery,
    publishResearch
  } = useContext(SidebarContext);


  const [queries, setQueries] = useState([]);
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [end, setEnd] = useState(false);

  const [title, setTitle] = useState("")
  const [thumbnail, selectThumbnail] = useFileUpload();
  const [researchFile, selectResearchFile] = useFileUpload();
  const [publishLoading, setPublishLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [progressLabel, setProgressLabel] = useState("3 steps away...");



  useEffect(()=> {

    if(title.length <= 2)
    {
      setProgressValue(0);
      setProgressLabel("3 steps away...");
    }

    else if(title.length > 2 && !thumbnail)
    {
      setProgressValue(25);
      setProgressLabel("now pick a thumbnail to go with the title.");
    }


    else if(thumbnail && !researchFile)
    {
      setProgressValue(50);
      setProgressLabel("you're almost there, just select your research paper!");
    }

    else
    {
      setProgressValue(75);
      setProgressLabel("last step, press that little button on the bottom right corner.");
    }
  }, [title, thumbnail, researchFile, progressLabel, progressValue])




  const toast = useToast();


  const myResearchDrawer = useDisclosure();


  const publishDrawer = useDisclosure();


  const publish = async () => {
    setProgressValue(100);
    setProgressLabel("Just a sec, uploading these files takes some time.");

    let thumbnailSafe = await checkImage(thumbnail);

    setPublishLoading(true);


    if(!thumbnailSafe){
      toast({
        status: "error",
        title: "Thumbnail is not safe for work!",
        description: "Please respect our terms of service.",
        duration: 3000
      })
    }

    if(title.length < 3 | title.length > 100)
    {
      setPublishLoading(false);

      toast({
        status: "info",
        title: "Title must be more than 2 characters long and less than or equal to 100 characters!",
        duration: 3000
      })

    }

    else if(!thumbnail)
    {
      setPublishLoading(false);

      toast({
        status: "info",
        title: "Please select a thumbnail for your research.",
        duration: 3000
      })
    }

    else if(!researchFile)
    {
      setPublishLoading(false);

      toast({
        status: "info",
        title: "Please select your research (pdf file).",
        duration: 3000
      })
    }


    else{
      const response = await publishResearch(title, thumbnail, researchFile);

      const data = await response.json();


      if(response.status!==200)
      {
        setPublishLoading(false);
        toast({
          status: "error",
          title: "Error publishing your research!.",
          description: errorToReadable(data), 
          duration: 5000
        })
      }

      else{
        setPublishLoading(false);
       toast({
          status: "success",
          title: `Successfully published "${title}"`,
          duration: 5000
        })

        publishDrawer.onClose();

      }
    }

    setProgressLabel("3 steps away...");
    setProgressValue(0);
  }



  const getTopQueries = async () => {

    setSearchLoading(true);


    const response = await getTopSearchQueries();



    if(response.status===200)
    {
      const data = await response.json();
      setQueries(data);
    }
    else{
      setEnd(true);
    }

    setSearchLoading(false);

  }


  useEffect(()=> {
    if(!queries.length && !end)
    {
      getTopQueries();
    }
  }, [!queries.length, !end])



  const searchQueries = async (query) => {

    setQuery(query);

    if(query.length)
    {

      setSearchLoading(true);

      const response = await getSimilarQueries(query);


      if(response.status===200)
      {
        const data = await response.json();
        setQueries(data);
      }

      setSearchLoading(false);

      setQuery(query);
    }

  }


  const renderSimilarQuery = (similarQuery) => {
    return (
      <AutocompleteItem 
        key={similarQuery.id}
        textValue={similarQuery.query}
      >
        <Text>
          {similarQuery.query}
        </Text>
      </AutocompleteItem>
    )
  }



  const search = () => {

    if(query.length)
      insertSearchQuery(query);

    searchPapers(query);

  }



  return (
    <HStack
      width={"100%"}
    >
      <NavBack />

      <Spacer />
      <Spacer />

      <Autocomplete
      isLoading={searchLoading}
      classNames={{
        base: "max-w-md",
        listboxWrapper: "max-h-[320px]",
        selectorButton: "text-default-500",
      }}
      defaultItems={queries}
      inputProps={{
        classNames: {
          input: "ml-2",
          inputWrapper: "h-[44px]",
        },
      }}
      listboxProps={{
        hideSelectedIcon: true,
        itemClasses: {
          base: [
            "rounded-medium",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "dark:data-[hover=true]:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[hover=true]:bg-default-200",
            "data-[selectable=true]:focus:bg-default-100",
            "data-[focus-visible=true]:ring-default-500",
          ],
        },
      }}
      aria-labelledby="research-search"
      placeholder="Search"
      popoverProps={{
        offset: 10,
        classNames: {
          base: "rounded-large",
          content: "p-1 border-small border-default-100 bg-background",
        },
      }}
      startContent={<Search size={20} />}
      radius="full"
      variant="bordered"
      onInputChange={searchQueries}
      onKeyDown={(k)=> {
          if(k.code==="Enter")
            search();
        }}
      >
        {
          (item) => renderSimilarQuery(item)
        }
      </Autocomplete>

      <Spacer />

      <HStack>

      <Button
        onPress={publishDrawer.onOpen}
        endContent={<FaPenNib size={20} />}
        variant="bordered"
        isDisabled={!isAuthenticated()}
      >
        publish
      </Button>

      <Spacer/>

      <Button
        onPress={myResearchDrawer.onOpen}
        endContent={<MdLibraryBooks size={20} />}
        variant="bordered"
        isDisabled={!isAuthenticated()}
      >
        my research
      </Button>
      </HStack>



      <Drawer
        isOpen={publishDrawer.isOpen} 
        onClose={publishDrawer.onClose}
        onOpen={publishDrawer.onOpen}
        placement="bottom"
        isFullHeight
      >
        <DrawerOverlay />
        <DrawerContent
          className="bg-background"
        >

          <DrawerHeader className="bg-background">
            <Spacer/>
            <DrawerCloseButton/>
          </DrawerHeader>

          <DrawerBody className="bg-background">
            <VStack
              height={"100%"}
              width={"100%"}
              className="w-full h-full bg-background"
              padding={"2%"}
            >
              <Progress color="default" label={progressLabel} value={progressValue}  className="max-w-md" />
              <Spacer/>


              <HStack width={"50%"} maxW={"500px"}>
                <Skeleton style={{width: "100%"}} isLoaded={!publishLoading}>
                  <Input 
                    placeholder="title"
                    size="md"
                    onChange={(e)=>{setTitle(e.target.value)}}
                  />
                </Skeleton>
              </HStack>



              <VStack marginTop={50} spacing={50}>
                <Skeleton isLoaded={!publishLoading}>
                  <Button
                    variant="bordered"
                    color="default"
                    onPress={()=> {
                      selectThumbnail({"accept": "image/*", multiple: false});
                    }}
                    endContent={<FaImage size={20} />}
                    isDisabled={title.length<3}
                    size="lg"
                  >
                    pick a thumbnail
                  </Button>
                </Skeleton>
              

                <Skeleton isLoaded={!publishLoading}>
                  <Button
                    variant="bordered"
                    size="lg"
                    isDisabled={!thumbnail ? true : title.length<3 ? true : false}
                    onPress={()=>{
                      selectResearchFile({"accept": "application/pdf", multiple: false});
                    }}
                    endContent={<FaRegFilePdf size={20} />}
                  >
                    select the pdf
                  </Button>
                </Skeleton>
              </VStack>


              <Spacer/>
              <Spacer/>
              <Spacer/>

              <HStack width="100%">
                <Spacer/>
                <Skeleton isLoaded={!publishLoading}>
                  <Button isDisabled={title.length < 3 || !thumbnail || !researchFile} onPress={publish} variant="bordered">
                    publish
                  </Button>
                  </Skeleton>
              </HStack>

            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>



      <Drawer
        isOpen={myResearchDrawer.isOpen} 
        onClose={myResearchDrawer.onClose}
        onOpen={myResearchDrawer.onOpen}
        placement="bottom"
        isFullHeight
      >
        <DrawerOverlay />
        <DrawerContent
          className="bg-background"
          height={"100%"}
        >
          <DrawerHeader className="bg-background">
            <HStack>
              <Spacer />
            <DrawerCloseButton/>
            </HStack>
          </DrawerHeader>

          <DrawerBody className="w-full h-full bg-background">
            <RenderMyResearch />
          </DrawerBody>
        </DrawerContent>
      </Drawer>




   </HStack>
  )
}

