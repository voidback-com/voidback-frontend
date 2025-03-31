'use client'
import { HStack, VStack, Spacer, Text, useToast, useColorMode, Show } from "@chakra-ui/react";
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { Bell, LogIn, Moon, Plus, Search, Sun, Trash, X } from "@geist-ui/icons";
import { Autocomplete, Chip, Spinner, Button, useDisclosure, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Input, Textarea, Checkbox, AutocompleteItem, Avatar } from "@nextui-org/react";
import { CategoryInput } from "@/app/globalComponents/CategoryInput";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { AuthContext } from "@/app/providers/AuthProvider";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/configs/api";
import VoidBackEditor from "@/app/editor/editorDrawer";




export const Topbar = ({ showNavBack, setPosts }) => {


  const { createRoom } = useContext(LeftFeedContext);
  const { account } = useContext(AuthContext);

  const newWriteUpModal = useDisclosure();

  const {
    newNotifications
  } = useContext(LeftFeedContext);



  const [queries, setQueries] = useState([]);
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const [skip, setSkip] = useState(0);




  const searchQueries = (query) => {


    if(query.length)
    {
      setSearchLoading(true);

      setQuery(query);
    }
  }


  const renderSimilarQuery = (similarQuery) => {
    return (
      <AutocompleteItem 
        key={similarQuery.id}
        textValue={similarQuery.query}
        itemType="submit"
      >
        <Text>
          {similarQuery.query}
        </Text>
      </AutocompleteItem>
    )
  }


  const router = useRouter();


  const search = async () => {

    setSearchLoading(true);



    const response = await fetch(API_URL+`exploreSearch?query=${query}&skip=${skip}&limit=${skip+6}&category=posts`, {
      method: "GET"
    })

    const data = await response.json();


    if(data && data.length)
    {
      setPosts(data);
      setSkip(skip+5);
    }

    setSearchLoading(false);
  }


  const toast = useToast();


  const colorMode = useColorMode();


  return (
    <HStack
      height={"10vh"}
      width="100%"
      bg={"default"}
      className="border-0"
      overflow={"hidden"}
      spacing={0}
      padding={10}
    >

      <Button
        _hover={{opacity: "70%"}}
        marginLeft={3}
        onPress={()=>router.push("/profile")}
        variant="unstyled"
        size="md"
      >
        <Avatar 
          size={"md"} 
          radius="md"
          src={account && account.avatar}
          className="border-1"
        />
      </Button>



      <Spacer />
      <Autocomplete
        isLoading={searchLoading}
        size="sm"
        classNames={{
          base: "max-w-sm",
          listboxWrapper: "max-h-[320px]",
          selectorButton: "text-default-500",
        }}
        defaultItems={queries}
        inputProps={{
          classNames: {
            input: "ml-1",
            inputWrapper: "h-[45px]",
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
        aria-labelledby="home-search"
        placeholder="Search"
        popoverProps={{
          offset: 10,
          classNames: {
            base: "rounded-large",
            content: "p-1 border-1 border-default-100 bg-background",
          },
        }}
        startContent={<Search size={20} />}
        radius="full"
        variant="flat"
        onInputChange={searchQueries}
        menuTrigger="input"
        onKeyDown={(k)=> {
          if(k.key==="Enter")
          {
            search();
          }
        }}
        >
          {
            (item) => renderSimilarQuery(item)
          }
      </Autocomplete>


      <Spacer />

      <HStack>

        {
          account
          ?
            <Button 
              size="sm"
              variant="light"
              onPress={()=>router.push("/notifications")}
            >
              <HStack className="flex flex-row justify-between">
                <Bell />
                { newNotifications &&
                <Chip color="primary" size="sm">
                  {newNotifications}
                </Chip>
                }
              </HStack>
            </Button>
          :
          null
        }

      <Show breakpoint="(min-width: 1000px)">
        <Button
          className="w-fit p-0"
          size="sm"
          variant="light"
          onPress={()=>colorMode.toggleColorMode()}
        >
          {colorMode.colorMode==="dark"
            ?
            <Sun />
            :
            <Moon />
          }
        </Button>
      </Show>


      {
        account
          ?
      <Button
        className="w-fit p-0"
        size="sm"
        variant="light"
        color="default"
        onPress={newWriteUpModal.onOpen}
      >
        <Plus />
      </Button>
      :
        <Button 
          size="sm"
          className="w-fit p-0"
          onPress={()=>router.push("/auth/login")}
          variant={"unstyled"}
          _hover={{opacity: "70%"}}
        >
          <LogIn />
        </Button>
      }

      </HStack>


      <VoidBackEditor onOpen={newWriteUpModal.onOpen} isOpen={newWriteUpModal.isOpen} onClose={newWriteUpModal.onClose} />
    </HStack>
  )
}



