'use client'
import { useState, useEffect, useContext } from "react";
import { Divider, HStack, Spacer, Show, Text, VStack, Modal, ModalBody, ModalCloseButton, Skeleton, ModalContent, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";
import { AlignCenter, AlignLeft, AlignRight, Bold, ChevronDown, ChevronDownCircleFill, Code, Image, Italic, Link, List, Menu, MoreHorizontal, MoreVertical, Plus, PlusCircle, Underline, Video, Youtube } from "@geist-ui/icons";
import { Button, Input, Select, SelectItem, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, PopoverContent, PopoverTrigger, Popover } from "@nextui-org/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react";
import { FaHeading } from "@react-icons/all-files/fa/FaHeading";
import { FaParagraph } from "@react-icons/all-files/fa/FaParagraph";
import { useFileUpload } from "use-file-upload";
import { errorToReadable, isError } from "@/app/configs/api";
import { EditorContext } from "@/app/providers/FeedsProvider/EditorProvider";
import { CategoryInput } from "@/app/globalComponents/CategoryInput";
import { BiFontSize } from "@react-icons/all-files/bi/BiFontSize"
import { VscReferences } from "@react-icons/all-files/vsc/VscReferences";
import { FaRulerHorizontal } from "@react-icons/all-files/fa/FaRulerHorizontal";





// choose font (add font menu next)




export const MainMenu = ({editor, title, setTitle, content, close, setContent}) => {


  const renderIcon = (s) => {
    switch(s)
    {
      case "p":
        return <FaParagraph />


      case "h1":
        return <HStack className="w-fit flex flex-row justify-around" gap={0}><FaHeading /><Text fontSize={"medium"} fontWeight={600}>1</Text></HStack>


      case "h2":
        return <HStack className="w-fit flex flex-row justify-around" gap={0}><FaHeading /><Text fontSize={"medium"} fontWeight={600}>2</Text></HStack>


      case "h3":
        return <HStack className="w-fit flex flex-row justify-around" gap={0}><FaHeading /><Text fontSize={"medium"} fontWeight={600}>3</Text></HStack>


      case "h4":
        return <HStack className="w-fit flex flex-row justify-around" gap={0}><FaHeading /><Text fontSize={"medium"} fontWeight={600}>4</Text></HStack>

 
      case "h5":
        return <HStack className="w-fit flex flex-row justify-around" gap={0}><FaHeading /><Text fontSize={"medium"} fontWeight={600}>5</Text></HStack>

  
      case "h6":
        return <HStack className="w-fit flex flex-row justify-around" gap={0}><FaHeading /><Text fontSize={"medium"} fontWeight={600}>6</Text></HStack>


      default:
        return null

    }
  }


  const getSelected = () => {

    if(editor.isActive("heading", {level: 1}))
      return "h1"

    else if(editor.isActive("heading", {level: 2}))
      return "h2"


    else if(editor.isActive("heading", {level: 3}))
      return "h3"

    else if(editor.isActive("heading", {level: 4}))
      return "h4"


    else if(editor.isActive("heading", {level: 5}))
      return "h5"

    else if(editor.isActive("heading", {level: 6}))
      return "h6"


    else if(editor.isActive("paragraph"))
      return "p"
  }

  const [selectedFontSize, setSelectedFontSize] = useState("12pt");


  const FontSizes = [
    "10pt",
    "11pt",
    "12pt",
    "13pt",
    "14pt",
    "15pt",
    "16pt",
    "17pt",
    "18pt",
    "19pt",
    "20pt",
    "21pt",
    "22pt",
    "23pt",
    "24pt",
  ]


  const modal = useDisclosure();
  const smodal = useDisclosure();


  const [series, setSeries] = useState(null);
  const [thumbnail, selectThumbnail] = useFileUpload();
  const [loading, setLoading] = useState(false);


  const { getMySeries, newSeries, handleWriteUp } = useContext(EditorContext);


  const [seriesList, setSeriesList] = useState(null);

  const [seriesName, setSeriesName] = useState(false);

  const [tags, setTags] = useState([]);


  const toast = useToast();


  const fetchSeries = async () => {
    const res = await getMySeries();
    const data = await res.json();

    if(isError(data))
    {
      setSeriesList([]);

      toast({
        title: "Error fetching your series.", 
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }
    else{
      setSeriesList(data);
    }
  }


  const createSeries = async () => {
    const res = await newSeries(seriesName);

    const dat = await res.json();

    if(res.status==200)
    {
      setSeriesList()

      toast({
        title: "Created series.",
        duration: 4000,
        status: "success"
      });

      smodal.onClose();

    }

    else{
      toast({
        title: "Error trying to create the series!",
        description: errorToReadable(dat),
        duration: 4000,
        status: "error"
      });
    }

  }


  useEffect(()=> {
    if(!seriesList)
      fetchSeries();
  }, [!series, seriesName, !seriesList])



  const handlePublish = async () => {

    setLoading(true);

    const response = await handleWriteUp(title, content, thumbnail, series ? series.id : null, tags);

    const data = await response.json();


    if(response.status===200)
    {
      toast({
        title: "Published successfully.",
        status: "success",
        duration: 4000
      });

      setTitle(null);
      setContent(null);
      close();

    }

    else{
      toast({
        title: "Error publishing write up!",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      });
    }

    smodal.onClose();
    modal.onClose();

    setLoading(false);

  }


  const getCurrentFontSize = () => {
    if(editor.getAttributes("textStyle")?.fontSize)
    {
      setSelectedFontSize(editor.getAttributes("textStyle").fontSize);
    }
    else{
      setSelectedFontSize("12pt");
    }
  }


  useEffect(()=> {
    getCurrentFontSize();
  }, [content])



  return (
    <div className="border-1 w-full rounded-lg p-2 flex flex-row  gap-2 border-b-0 rounded-b-none">


        <Button
          variant="light"
          size="sm"
        className={editor.isActive({textAlign: "left"}) && "bg-default-200"}
          onPress={()=>editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft />
        </Button>



        <Button
          variant="light"
          size="sm"
        className={editor.isActive({textAlign: "center"}) && "bg-default-200"}
          onPress={()=>editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter />
        </Button>


        <Button
          variant="light"
          size="sm"
        className={editor.isActive({textAlign: "right"}) && "bg-default-200"}
          onPress={()=>editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight />
        </Button>


      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="bordered"
            size="sm"
            className="border-0"
          >
            {renderIcon(getSelected())}
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          disallowEmptySelection
          selectedKeys={[getSelected()]}
          selectionMode="single"
          variant="flat"
        >
           <DropdownItem
            key={"p"}
            onPress={()=>editor.chain().focus().setParagraph().run()}
          >
            P
          </DropdownItem>

          <DropdownItem
            key={"h1"}
            onPress={()=>editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </DropdownItem>

          <DropdownItem
            key={"h2"}
            onPress={()=>editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </DropdownItem>

          <DropdownItem
            key={"h3"}
            onPress={()=>editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </DropdownItem>


          <DropdownItem
            key={"h4"}
            onPress={()=>editor.chain().focus().toggleHeading({ level: 4 }).run()}
          >
            H4
          </DropdownItem>


          <DropdownItem
            key={"h5"}
            onPress={()=>editor.chain().focus().toggleHeading({ level: 5 }).run()}
          >
            H5
          </DropdownItem>

          <DropdownItem
            key={"h6"}
            onPress={()=>editor.chain().focus().toggleHeading({ level: 6 }).run()}
          >
            H6
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>


      <Button
        variant="bordered"
        className="border-0 rounded-md"
        size="sm"
        onPress={()=> editor.chain().focus().toggleBulletList().run()}
      >
        <List />
      </Button>





      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="bordered"
            size="sm"
            className="border-0 font-semibold text-sm"
          >
            <BiFontSize size={24} />
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          disallowEmptySelection
          selectedKeys={[selectedFontSize]}
          selectionMode="single"
          variant="flat"
        >

          {
            FontSizes.map((fontSize)=> {
              return <DropdownItem
                key={fontSize}
                onPress={()=> {
                  editor.chain().focus().setFontSize(fontSize).run();
                }}
              >
                {fontSize}
              </DropdownItem>
            })
          }
        </DropdownMenu>
      </Dropdown>

 

      <Button
        onPress={()=>editor?.commands.addFootnote()}
        variant="bordered"
        className="border-0 rounded-md"
        size="sm"
      >
        <VscReferences size={24} />
      </Button>

     

      <Spacer />

      <Show breakpoint="(min-width: 1000px)">
        <Input
          placeholder="Title..."
          className="max-w-[400px]"
          size="sm"
          defaultValue="Untitled"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />
      </Show>

      <Button
        variant="light"
        className="border-1 rounded-md"
        size="sm"
        onPress={modal.onOpen}
        isDisabled={!title || !content}
      >
        publish
      </Button>


      <Modal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
      >
        <ModalOverlay />

        <ModalContent
          backgroundColor={"default"}
          className="bg-background w-1/2"
          height={"90%"}
        >
          <ModalCloseButton />

          <ModalBody
            className="bg-background border-1 w-full rounded-md"
            padding={10}
            height={"100%"}
          >
            <Skeleton
              isLoaded={!loading}
            >
              <VStack
                height="100%"
                className="flex flex-col p-2 space-y-10"
              >
                <Button
                  onPress={()=>selectThumbnail({
                    "accept": "image/*",
                    "multiple": false
                  })}
                >
                  {
                    !thumbnail
                    ?
                  "pick a thumbnial"
                    : thumbnail.name
                  }
                </Button>


                <Select
                  isRequired={false}
                  label="Pick a Series (Optional)"
                >
                  <SelectItem
                    key={"new-series"}
                    onPress={smodal.onOpen}
                  >
                    New Series
                  </SelectItem>

                  {seriesList && seriesList.map((s)=> {
                    return (
                      <SelectItem
                        key={s.name}
                        onPress={()=>setSeries(s)}
                      >
                        {s.name}
                      </SelectItem>
                    )
                  })}
                </Select>

                <CategoryInput setCategories={setTags} categories={tags} />

                <Spacer />

                <HStack
                  className="w-full flex flex-row justify-end"
                >
                  <Button
                    variant="bordered"
                    onPress={()=>handlePublish()}
                  >
                    Publish
                  </Button>
                </HStack>

              </VStack>
            </Skeleton>
          </ModalBody>

        </ModalContent>
      </Modal>



      <Modal
        isOpen={smodal.isOpen}
        onClose={smodal.onClose}
      >
        <ModalOverlay />

        <ModalContent
          backgroundColor={"default"}
          className="bg-background w-1/2"
          height={"80%"}
        >
          <ModalCloseButton />

          <ModalBody
            className="bg-background border-1 w-full rounded-md"
            padding={10}
            height={"100%"}
          >
            <VStack
              height="100%"
              className="flex flex-col py-20 space-y-5"
            >
              <Input 
                label="A series is a collection of write ups"
                isRequired
                onChange={(e)=>setSeriesName(e.target.value)}
                placeholder="Series Name" />
              <HStack className="flex flex-row w-full justify-center">


                <Button
                  variant="bordered"
                  size="md"
                  onPress={createSeries}
                  isDisabled={!seriesName}
                >
                  Create
                </Button>
              </HStack>
            </VStack>
          </ModalBody>

        </ModalContent>
      </Modal>



      </div>
  )
}




export const EditorSecondMenu = ({editor, handleImage, handleVideo}) => {


  return (
    <div
      className="w-full flex flex-row border-1 border-t-0 border-0 outline-0 space-x-7 rounded-b-xl rounded-t-xs bottom-0 relative p-2 gap-2"
    >

      <Button
        className="bg-default-0 p-0"
        onPress={handleImage}
        isIconOnly
      >
        <Image size={24} />
      </Button>

      <Button
        className="bg-default-0 p-0"
        onPress={handleVideo}
        isIconOnly
      >
        <Youtube size={24} />
      </Button>

      <Button
        className="bg-default-0 p-0"
        onPress={()=>editor.chain().focus().toggleCodeBlock().run()}
        isIconOnly
      >
        <Code size={24} />
      </Button>



      <Button
        className="bg-default-0 p-0"
      onPress={()=>editor.chain().focus().setHorizontalRule().run()}
        isIconOnly
      >
        <FaRulerHorizontal size={24} />
      </Button>

    </div>
  )
}


