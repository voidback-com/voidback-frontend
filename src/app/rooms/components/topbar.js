'use client'
import { HStack, VStack, Spacer, Text, useToast } from "@chakra-ui/react";
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { LogIn, Plus, Search, Trash, X } from "@geist-ui/icons";
import { Autocomplete, Spinner, Button, useDisclosure, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Input, Textarea, Checkbox, AutocompleteItem, Avatar } from "@nextui-org/react";
import { CategoryInput } from "@/app/globalComponents/CategoryInput";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { RoomMemberPermissions } from "@/app/globalComponents/RoomMemberPermissions";
import { AuthContext } from "@/app/providers/AuthProvider";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import { RightFeedContext } from "@/app/providers/FeedsProvider/RightFeedProvider";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/configs/api";




export const Topbar = ({ showNavBack, setPosts }) => {


  const { createRoom } = useContext(LeftFeedContext);
  const { account } = useContext(AuthContext);

  const newRoomModal = useDisclosure();
  const memberConfModal = useDisclosure();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [defaultMembersPermissions, setDefaultMembersPermissions] = useState({});
  const [loading, setLoading] = useState(false);



  const {
    insertRoomsSearchQuery,
    getTopRoomsSearchQueries,
    getSimialRoomsQueries
  } = useContext(LeftFeedContext);



  const [queries, setQueries] = useState([]);
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const [skip, setSkip] = useState(0);



  useEffect(()=> {
    if(!queries.length && !end)
    {
      setSearchLoading(true);
      getTopRoomsSearchQueries().then((res)=> {
        if(res)
        {
          setQueries(res);
          setSearchLoading(false);
        }
        else{
          setEnd(true);
          setSearchLoading(false);
        }
      })
    }
  }, [!queries.length, !end])



  const searchQueries = (query) => {


    if(query.length)
    {
      setSearchLoading(true);

      getSimialRoomsQueries(query).then((res)=> {
        if(res)
          setQueries(res);
        setSearchLoading(false);
      })

      setQueries(p=>[...p, {query: query, id: Math.random()}]);

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

    insertRoomsSearchQuery(query);


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


  const handleCreate = async () => {
    if(!account || !account?.id) return;

    setLoading(true);

    let perms = defaultMembersPermissions;

   const permissions = {
    is_moderator: false,
    can_delete_posts: false,
    can_remove_members: false,
    can_remove_moderators: false,
    can_add_moderators: false,
    can_post: true,
    can_like: true,
    can_dislike: true,
    can_reply: true,
    can_post_image: false,
    can_add_members: true
  };



    if(JSON.stringify(perms)==="{}")
    {
      perms = permissions;
    }

    const conf = {default_member_permissions: perms, admin: account.id};

    const response = await createRoom(name, description, categories, conf);

    if(response.status==201)
    {
      newRoomModal.onClose();

      toast({
        title: "Successfully created your room.",
        description: `successfully created "${name}".`,
        status: "success",
        duration: 4000
      });
    }

    else{
      toast({
        title: "Failed to create your room.",
        description: `Please try again...`,
        status: "error",
        duration: 4000
      });
    }

    setLoading(false);

  }


  if(loading)
  {
    return (
      <HStack className="w-full justify-center border-b-1">
        <Spinner color="default" size="lg" className="my-5" />
      </HStack>
    )
  }


  return (
    <HStack
      height={"10vh"}
      width="100%"
      bg={"default"}
      className="border-1"
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
        classNames={{
          base: "max-w-md",
          listboxWrapper: "max-h-[320px]",
          selectorButton: "text-default-500",
        }}
        defaultItems={queries}
        inputProps={{
          classNames: {
            input: "ml-1",
            inputWrapper: "h-[48px]",
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
            content: "p-1 border-small border-default-100 bg-background",
          },
        }}
        startContent={<Search size={20} />}
        radius="full"
        variant="bordered"
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

      {
        account
          ?
      <Button
        className="w-fit p-0 border-1"
        size="sm"
        variant="light"
        color="default"
        onPress={newRoomModal.onOpen}
      >
        <Plus />
      </Button>
      :
        <Button 
          size="sm"
          onPress={()=>router.push("/auth/login")}
          variant={"unstyled"}
          _hover={{opacity: "70%"}}
        >
          <LogIn />
        </Button>
      }


      <Modal
        isOpen={newRoomModal.isOpen}
        onOpenChange={newRoomModal.onOpenChange}
      >
        <ModalContent className="bg-background border-1">
          {(onClose) => (
            <>
              <ModalHeader>
                Create a room
              </ModalHeader>

              <ModalBody>
                <VStack className="w-full h-full flex flex-col justify-center" gap={5}>
                  <Input onChange={(e)=>setName(e.target.value)} isRequired label="Name Your Room" placeholder="name..." />
                  <Textarea onChange={(e)=>setDescription(e.target.value)} isRequired label="Describe Your Room" placeholder="description (in markdown)..." />
                  


                  <CategoryInput setCategories={setCategories} categories={categories} />
                  <Button
                    variant="light"
                    className="border-1 bg-default-0"
                    onPress={memberConfModal.onOpen}
                  >
                    Configure Members Permissions
                  </Button>


                  {/* configure member permissions modal */}
                  <Modal
                   isOpen={memberConfModal.isOpen}
                    onOpenChange={memberConfModal.onOpenChange}
                  >
                    <ModalContent
                      className="bg-background border-1"
                    >
                      {(onClose) => (
                        <>
                          <ModalHeader>
                            Configure Default Permissions
                          </ModalHeader>

                          <ModalBody>
                            <RoomMemberPermissions setMemberPermission={setDefaultMembersPermissions} />
                          </ModalBody>
                        </>

                      )}
                    </ModalContent>
                  </Modal>

                </VStack>

              </ModalBody>

              <ModalFooter>
    <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button variant="light" className="border-1 bg-default-0" onPress={()=>handleCreate()}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
          
        </ModalContent>
      </Modal>

    </HStack>
  )
}



