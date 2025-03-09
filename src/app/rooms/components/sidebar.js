'use client'
import { VStack, Text, HStack, Show, Wrap, Divider, useColorMode } from "@chakra-ui/react";
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { Tabs, Tab, Spinner, Chip, useDisclosure, Button, Tooltip } from "@nextui-org/react";
import { Feather, Home, MessageCircle, Settings } from "@geist-ui/icons";
import { usePathname } from "next/navigation";
import { FaStarOfLife } from "@react-icons/all-files/fa/FaStarOfLife";
import { useRouter } from "next/navigation";
import { Touchable } from "@/app/auth/components";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import VoidBackEditor from "@/app/editor/editorDrawer";
import { AuthContext } from "@/app/providers/AuthProvider";
import { LeftSection } from "@/app/home/components/Sections";
import MarkdownPreview from "@uiw/react-markdown-preview";











export const Sidebar = () => {


  return (
    <VStack
      height={"100vh"}
      width="30%"
      bg={"default"}
      className="border-1"
      style={{overflowY: "scroll", borderTopWidth: 0}}
      spacing={0}
    >
      <LeftSection currentSelection={"/rooms"} />
    </VStack>
  )
}



export const RoomViewSidebarLeft = ({room}) => {

  const editor = useDisclosure();

  return (
    <VStack
      height={"100vh"}
      width="30%"
      bg={"default"}
      className="border-1"
      style={{borderTopWidth: 0, overflowY: "scroll"}}
      spacing={0}
    >

      <LeftSection currentSelection={"/rooms"} />
      <Divider />

      <Button className="rounded-none w-full font-semibold" size="lg" variant="light" onPress={editor.onOpen} startContent={<Feather/>}>
        <Show breakpoint="(min-width: 1000px)">
        new post
        </Show>
      </Button>
      
      <VoidBackEditor isOpen={editor.isOpen} onOpen={editor.onOpen} onClose={editor.onClose} room={room} />
      
    </VStack>
  )
}





export const RoomViewSidebarRight = ({room}) => {

  const { account } = useContext(AuthContext);


  const isModerator = () => {
    if(account)
    {
      if(account.username===room.config.admin.username)
      {
        return true;
      }
      else{
        // check room membership if user is a mod
        return false;
      }
    }
    else{
      return false;
    }
  }


  if(!room)
    return null;


  const hdate = require("human-date");


  const colorMode = useColorMode();



  return (
    <VStack
      width="40%"
      bg={"default"}
      className="h-full border-1 max-w-[350px] min-w-[200px] overflow-y-scroll border-t-0"
      spacing={5}
      style={{overflowY: "scroll", paddingBottom: 100}}
    >

      <VStack className="w-full flex flex-col justify-center">
 
        {
          isModerator()

            ?

        <Button variant="bordered" className="border-1 my-5" size="sm" startContent={<Settings size={15} />}>
          <Tooltip className="p-2" content="Mod tools feature is currently in-development">
            moderator tools
          </Tooltip>
        </Button>
          :
            null
        }

     
        <Text fontSize={24} fontWeight={600} className="my-5">{room.name}</Text>

        <Chip variant="bordered" className="rounded-md">
          <Text className="w-2/3 font-bold text-sm">Created on {hdate.prettyPrint(room.created_at)}</Text>
      </Chip>

        <Chip variant="bordered" className="rounded-md">
          <Text className="w-2/3 font-bold text-sm">Run by {room.config.admin.full_name}</Text>
      </Chip>
      </VStack>


        <MarkdownPreview 
          source={room.description} 
          style={{backgroundColor: "transparent"}}
          className="border-0 p-5 w-[98%]"
          wrapperElement={{
            "data-color-mode": colorMode.colorMode
          }}
        />


      <Wrap className="h-full w-full p-5">
        {room.categories.map((category)=> {
          return <Chip size="sm" className="p-4" variant="bordered">{category.category}</Chip>
        })}
      </Wrap>
    </VStack>
  )
}



export const RoomsSidebarRight = () => {

  const { getTopRankingRooms, getMyRooms } = useContext(LeftFeedContext);

  const [rooms, setRooms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const [page, setPage] = useState(1);

  
  const getTopRooms = async () => {
    setLoading(true);

    const response = await getTopRankingRooms();

    const data = await response.json();


    if(response.status===200)
    {
      if(rooms && rooms.length)
        setRooms(p=>[...p, ...data]);
      else
        setRooms(data);
    }

    setLoading(false);
  }

  
 const fetchMyRooms = async () => {

    if(loading || end) return;

    setLoading(true);

    const response = await getMyRooms(page);

    const data = await response.json();

    if(response.status===200)
    {

      if(data.next)
        setPage(page+1);
      else
      {
        setEnd(true);
      }

      if(data.results && data.results.length)
      {
        if(rooms && rooms.length)
          setRooms(p=>[...p, ...data.results]);
        setRooms(data.results);
      }

      else{
        setEnd(true);
      }
    }
    else{
      setEnd(true);
    }

    setLoading(false);
  }



  useEffect(()=> {
    if(!rooms)
    {
      fetchMyRooms();
    }
  }, [!rooms])


  useEffect(()=> {
    if(end)
    {
      getTopRooms();
    }
  }, [end])

  const hdate = require("human-date");

  const router = useRouter();

  const human = require("human-readable-numbers");

  return (
    <VStack
      width="40%"
      bg={"default"}
      className="h-full border-1 max-w-[350px] min-w-[200px] overflow-y-scroll border-t-0 p-10"
      spacing={5}
      style={{overflowY: "scroll", paddingBottom: 100}}
    >
      {loading && <Spinner className="my-10" color="default" size="sm" />}
      {rooms && rooms.map((x)=> {
        return (
          <VStack className="w-full border-1 rounded-md">
            <HStack
              className="w-full flex flex-row justify-center border-b-1"
            >
              <Touchable
                onPress={()=>x['room']?router.push(`/rooms/${x.room.name}`):router.push(`/rooms/${x.name}`)}
              >
                <Text
                  className={"p-3 w-full"+` ${!x['room'] && "text-green-500"}`}
                  fontFamily={"monospace"}
                  fontWeight={600}
                  textAlign="center"
                >
                  r/{x['room'] ? x.room.name : x.name}
                </Text>
              </Touchable>

            </HStack>

            { x['room'] &&
              <HStack
                className="flex flex-row justify-center border-b-1 p-2"
              >
                <Text fontFamily={"sans-serif"} fontSize={15} fontWeight={600}>Members</Text>
                <Text
                  fontFamily={"monospace"}
                  fontWeight={600}
                  textAlign="center"
                >
                {human.toHumanString(x.members)}
                </Text>
              </HStack>
            }


            { x['room'] &&
            <HStack
              className="flex flex-row justify-center border-b-1 p-2"
            >
              <Text fontFamily={"sans-serif"} fontSize={15} fontWeight={600}>Rank</Text>
              <Text
                fontFamily={"monospace"}
                fontWeight={600}
                textAlign="center"
              >
                {human.toHumanString(x.room.rank)}
              </Text>
            </HStack>
            }


            <HStack
              className="w-full flex flex-row justify-center p-4"
            >
              <Text fontFamily={"sans-serif"} fontSize={12} fontWeight={600}>Created on</Text>
              <Text
                fontFamily={"monospace"}
                fontWeight={600}
                textAlign="center"
                fontSize={12}
              >
                {x['room'] ? hdate.prettyPrint(x.room.created_at) : hdate.prettyPrint(x.created_at)}
              </Text>
            </HStack>


            <HStack
              className="w-full flex flex-row justify-center"
            >

              <Wrap className="h-full w-full p-5">
                {
                x['room'] ? 

                x.room.categories.map((category)=> {
                  return <Chip size="sm" className="p-4" variant="bordered">{category.category}</Chip>
                    })
                  :

                x.categories.map((category)=> {
                  return <Chip size="sm" className="p-4" variant="bordered">{category.category}</Chip>

                })
                }
              </Wrap>
            </HStack>



          </VStack>
        )
      })}
    </VStack>
  )
}


