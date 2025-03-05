'use client'
import { VStack, Text, HStack, Show, Wrap } from "@chakra-ui/react";
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
import Markdown  from "react-markdown";
import { AuthContext } from "@/app/providers/AuthProvider";








export const Section = ({title, items, defaultSelected, loading}) => {


  const router = useRouter();

  return (
    <VStack
      className="h-fit w-full border-b-1 pb-5 flex flex-row justify-center"
    >

      <Text className="py-4 font-semibold" fontFamily={"Roboto"}>{title}</Text>

      {loading && <Spinner className="my-2" color="default" size="md" />}

      <Tabs
        selectedKey={defaultSelected ? defaultSelected : ""}
        variant="light"
        className="h-full"
        isVertical
        onSelectionChange={(e)=> {
          // if(e=="DMs")
            // return router.push("/dm")
          if(e=="Home")
            return router.push("/home")
        }}
      >


        {items.map((i)=> {
          return (
            <Tab
              key={i.name}
              className="flex flex-row justify-start"
              title={
                i.onClick
                ?
                  <Touchable onPress={i.onClick}>
                    <HStack spacing={5}>
                      <Show breakpoint="(min-width: 1000px)">
                      {i.icon}
                      </Show>


                        <Text fontSize={"medium"} fontWeight={600}  {...i.NameProps}>{i.name}</Text>

                    </HStack>
                  </Touchable>
                :
                  <HStack spacing={5}>
                    <Show breakpoint="(min-width: 1000px)">
                    {i.icon}
                    </Show>

                      <Text fontSize={"medium"} fontWeight={600}  {...i.NameProps}>{i.name}</Text>

                  </HStack>
                
              }
            />
          )
        })}
      </Tabs>
    </VStack>
  )
}


export const NavigationSection = () => {


  return (
    <Section title={""} items={[
      {"name": "Rooms", "icon": <FaStarOfLife size={23} />},
      {"name": "Home", "icon": <Home />},
    ]} 
    defaultSelected={"Rooms"} 
    />
  )


}


export const MyRoomsSection = () => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [end, setEnd] = useState(false);
  const [page, setPage] = useState(1);


  const { getMyRooms } = useContext(LeftFeedContext);


  const fetchRooms = async () => {

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
        data.results.map((x)=> {
          const r = {
            NameProps: {
              fontFamily: "monospace",
              fontSize: 15
            },
            name: 'r/'+x.name, 
            icon: <FaStarOfLife size={24} />, 
            onClick: ()=>router.push(`/rooms/${x.name}`), 
            room: x
          };

          setRooms(p=>p.filter((i)=> i.name !== r.name));
          setRooms(p=>[...p, r]);
        })
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
    if(!end && !loading)
    {
      fetchRooms();
    }
  }, [!end, !loading])



  return (
    <>
    <Section title={"My Rooms"} items={rooms} loading={loading} />

    </>
  )


}




export const Sidebar = () => {


  return (
    <VStack
      height={"100vh"}
      width="20%"
      bg={"default"}
      className="border-1 max-w-[200px] min-w-[150px]"
      style={{overflowY: "scroll", borderTopWidth: 0}}
      overflow={"hidden"}
      spacing={0}
    >

      <NavigationSection />

      <MyRoomsSection />
      
    </VStack>
  )
}



export const RoomViewSidebarLeft = ({room}) => {

  const editor = useDisclosure();

  return (
    <VStack
      height={"100vh"}
      width="20%"
      bg={"default"}
      className="border-1 max-w-[200px] min-w-[150px]"
      style={{overflowY: "scroll", borderTopWidth: 0}}
      overflow={"hidden"}
      spacing={0}
    >

      <NavigationSection />

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
      if(account.username!==room.config.admin.username)
      {
        return true;
      }
      else{
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


      <Wrap className="max-w-[90%]">
        <Markdown
          components={{
            "h1": (props) => {

              return <Text fontSize={"x-large"} className="font-semibold">{props.children}</Text>
            },

             "h2": (props) => {

              return <Text fontSize={"large"} className="font-semibold">{props.children}</Text>
            },


             "h3": (props) => {

              return <Text fontSize={"medium"} className="font-semibold">{props.children}</Text>
            },



             "h4": (props) => {

              return <Text fontSize={"small"} className="font-semibold">{props.children}</Text>
            },


             "h5": (props) => {

              return <Text fontSize={"smaller"} className="font-semibold">{props.children}</Text>
            },


             "blockquote": (props) => {

              return <blockquote fontSize={"large"} fontFamily="sans-serif" className="italic">{props.children}</blockquote>
            },




          }}
        >
          {room.description}
        </Markdown>
      </Wrap>


      <Wrap className="h-full w-full p-5">
        {room.categories.map((category)=> {
          return <Chip size="sm" className="p-4" variant="bordered">{category.category}</Chip>
        })}
      </Wrap>
    </VStack>
  )
}



export const RoomsSidebarRight = () => {

  const { getTopRankingRooms } = useContext(LeftFeedContext);

  const [rooms, setRooms] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const getTopRooms = async () => {
    console.log("fetching")
    setLoading(true);

    const response = await getTopRankingRooms();

    const data = await response.json();


    if(response.status===200)
    {
      setRooms(data);
    }

    setLoading(false);
  }


  useEffect(()=> {
    if(!rooms)
    {
      getTopRooms();
    }
  }, [!rooms])



  const hdate = require("human-date");

  const router = useRouter();


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
                onPress={()=>router.push(`/rooms/${x.room.name}`)}
              >
                <Text
                  className="p-3 w-full"
                  fontFamily={"monospace"}
                  fontWeight={600}
                  textAlign="center"
                >
                  r/{x.room.name}
                </Text>
              </Touchable>

            </HStack>

            <HStack
              className="flex flex-row justify-center border-b-1 p-2"
            >
              <Text fontFamily={"sans-serif"} fontSize={15} fontWeight={600}>Members</Text>
              <Text
                fontFamily={"monospace"}
                fontWeight={600}
                textAlign="center"
              >
                {x.members}
              </Text>
            </HStack>


            <HStack
              className="flex flex-row justify-center border-b-1 p-2"
            >
              <Text fontFamily={"sans-serif"} fontSize={15} fontWeight={600}>Rank</Text>
              <Text
                fontFamily={"monospace"}
                fontWeight={600}
                textAlign="center"
              >
                {x.room.rank}
              </Text>
            </HStack>


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
                {hdate.prettyPrint(x.room.created_at)}
              </Text>
            </HStack>


            <HStack
              className="w-full flex flex-row justify-center"
            >

              <Wrap className="h-full w-full p-5">
                {x.room.categories.map((category)=> {
                  return <Chip size="sm" className="p-4" variant="bordered">{category.category}</Chip>
                })}
              </Wrap>
            </HStack>



          </VStack>
        )
      })}
    </VStack>
  )
}


