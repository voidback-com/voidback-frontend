'use client'
import { 
  VStack,
  Stack,
  Spacer,
  HStack,
  Text,
  Skeleton,
  useColorMode,
  useDisclosure,
  Alert,
  Show,
  AlertIcon
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/providers/AuthProvider/index.js";
import { RightFeedContext } from "@/app/providers/FeedsProvider/RightFeedProvider.js";
import { useRouter } from "next/navigation.js";
import { Autocomplete, AutocompleteItem, Avatar, Chip, Card, Tabs, Tab, Button } from "@nextui-org/react";
import VoidBackEditor from "@/app/editor/editorDrawer";
import { FaDollarSign } from "@react-icons/all-files/fa/FaDollarSign";
import { FaHashtag } from "@react-icons/all-files/fa/FaHashtag";
import { Home as HomeIcon, Settings as SettingsIcon, Moon as MoonIcon, Sun as SunIcon, Feather, Bell as NotificationsIcon, RefreshCcw, Activity, LogIn, TrendingUp, MessageCircle  } from '@geist-ui/icons'
import { BsGraphUp } from "@react-icons/all-files/bs/BsGraphUp";
import { Search } from '@geist-ui/icons';
import { SidebarContext } from "@/app/providers/FeedsProvider/SidebarProvider";
import { FaStarOfLife } from "@react-icons/all-files/fa/FaStarOfLife";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import { FaBrain } from "@react-icons/all-files/fa/FaBrain";




export const LeftSection = ({currentSelection, showNavBack=false}) => {
  
  const { toggleColorMode, colorMode} = useColorMode();


  const { newNotifications } = useContext(SidebarContext);

  const { account } = useContext(AuthContext);



  const router = useRouter();

  const editor = useDisclosure();

  const buttons = ["editor", "theme"];
  const buttonsHandlers = [account ? editor.onOpen : ()=>router.push("/auth/login"), toggleColorMode];


  return (
    <VStack
      borderRightWidth={0}
      alignItems={"center"}
      overflow={"hidden"}
      style={{scrollbarWidth: "none"}}
    >
      {
        showNavBack
        ?
          <HStack
            position={"relative"}
            top={10}
          >
            <NavBack />
          </HStack>
        :
        null
      }
      <Spacer />

      <Tabs
        variant="light"
        isVertical
        size="lg"
        fullWidth
        selectedKey={currentSelection}
        onSelectionChange={(e)=> {

          if(buttons.indexOf(e)!==-1)
          {
            return buttonsHandlers[buttons.indexOf(e)]();
          }

          else if(e!==currentSelection)
          {
            return router.push(e);
          }

          else if(e==="/rooms")
            return router.push('/rooms');
        }}
      >

        {
          account && account.is_staff
          ?
 
          <Tab
            key={"/analytics"}
            className="flex flex-row justify-start"
            title={
              <HStack spacing={5} className="w-fit">
                <Activity size={25} />
                <Show breakpoint="(min-width: 1000px)">
                  <Text fontSize={"medium"} fontWeight={600}>Analytics</Text>
                </Show>
            </HStack>
            }
          />
           
          :
          null
        }


        <Tab
          key={"/rooms"}
          className="flex flex-row justify-start w-full"
          title={
            <HStack spacing={5} className="w-fit">
              <HomeIcon size={25} />
              <Show breakpoint="(min-width: 1000px)">
                <Text fontSize={"medium"} fontWeight={600}>Home</Text>
              </Show>
          </HStack>
          }
        />

        <Tab
          key={"/dm"}
          className="flex flex-row justify-start"
          title={
            <HStack spacing={5}>
              <MessageCircle size={25} />
              <Show breakpoint="(min-width: 1000px)">
                <Text fontSize={"medium"} fontWeight={600}>DMs</Text>
              </Show>
          </HStack>
          }
        />



        {/* Machine Learning Hub (open source data and models) */}
        <Tab
          isDisabled
          key={"/investor-hub"}
          className="flex flex-row justify-start"
          title={
            <HStack spacing={5}>
              <FaBrain size={25} />

              <Show breakpoint="(min-width: 1000px)">
                <Text fontSize={"medium"} fontWeight={600}>ML Hub</Text>
                <Chip size="sm">
                  in-dev
                </Chip>
              </Show>

            </HStack>
          }
        />



        <Tab
          key={"/notifications"}
          className="flex flex-row justify-start"
          title={
            <HStack spacing={5}>
              <HStack spacing={1}>
                <NotificationsIcon size={25} />
                {
                  newNotifications
                  &&
                  <Chip radius="full" color="primary" variant="solid" size="sm">
                    {newNotifications}
                  </Chip>
                }
              </HStack>

              <Show breakpoint="(min-width: 1000px)">
                { !newNotifications
                  &&
                <Text fontSize={"medium"} className="justify-self-end" fontWeight={600}>Notifications</Text>
                }
              </Show>
            </HStack>
          }
        />


        <Tab
          key={"/settings"}
          className="flex flex-row justify-start"
          title={
            <HStack width={"100%"} spacing={5}>
              <SettingsIcon size={25} />
              <Show breakpoint="(min-width: 1000px)">
                <Text fontSize={"medium"} fontWeight={600}>Settings</Text>
              </Show>
            </HStack>
          }
        />


      <Tab
        key={"theme"}

        className="flex flex-row justify-start"
        title={
          <HStack width="100%" spacing={5}>
            {
              colorMode==="dark"
              ?
                <SunIcon size={25} />
              :
                <MoonIcon size={25} />
            }



            <Show breakpoint="(min-width: 1000px)">
                {
                colorMode==="light"
                ?
                  <Text fontSize={"medium"} fontWeight={600}>Dark Theme</Text>
                :
                <Text fontSize={"medium"} fontWeight={600}>Light Theme</Text>
                }
            <Spacer/>
            </Show>
          </HStack>
        }
      />



      </Tabs>


    </VStack>
  )
}



const CenterSection = ({ActiveFeed}) => {

  const { account } = useContext(AuthContext);


  const [refresh, setRefresh] = useState(false);


  const router = useRouter();


  const editor = useDisclosure();


  return (
    <VStack
      width="100%"
      height="100vh"
      style={{scrollbarWidth: "none"}}
      gap={0}
      spacing={0}
    >
      {/* TOP LEFT SECTION */}
      <HStack
        marginTop={4}
        width="100%"
        height="8vh"
        maxHeight="100px"
        borderWidth={0}
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

        { 
          (account)
          ?
          <Button 
            onPress={editor.onOpen}
            variant={"unstyled"}
            _hover={{opacity: "70%"}}
          >
            <Feather />
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

      </HStack>


      {/* Active Feed */}
      <VStack
        width="100%"
        height="100%"
        overflowY={"scroll"}
        overflowX={"hidden"}
        style={{scrollbarWidth: "none"}}
      >
        <ActiveFeed setRefresh={setRefresh} refresh={refresh} />
      </VStack>


      {/* voidback editor drawer */}
      <VoidBackEditor isOpen={editor.isOpen} onOpen={editor.onOpen} onClose={editor.onClose} />

    </VStack>
  )

}



const Symbol = ({symbol, count}) => {

  const format = require("human-readable-numbers");

  const router = useRouter();

  return (
    <Card
      onPress={()=>router.push(`/symbol/${symbol.symbol}`)}
      className="w-full rounded-md shadow-none my-3 h-fit p-2 flex flex-col bg-background"
      isPressable
    >
      <div className="w-full flex flex-row justify-around">
        <Text
          fontSize={14}
          fontWeight="600"
          className="place-self-start text-emerald-500"
        >
          ${symbol.symbol}
        </Text>

        <Spacer />

        {symbol.location && symbol.location.length>0 &&
          <div
            className="w-fit flex flex-row gap-1"
          >
            <Text  
              color="lightslategrey"
              fontSize={11}
              fontFamily={"sans-serif"}
              fontWeight={600}
            >
              trending in
            </Text>
            <Text  
              fontSize={11}
              fontFamily={"sans-serif"}
              fontWeight={600}
            >
              {symbol.location}
            </Text>
          </div>
        }

      </div>


      <Skeleton isLoaded={count} className="w-full flex flex-row gap-1 justify-start">
          <Text  
            color="lightslategrey"
            fontSize={11}
            fontFamily={"sans-serif"}
            fontWeight={600}
          >
            {count ? format.toHumanString(count.posts) : null}
          </Text>

          <Text  
            fontSize={11}
            fontFamily={"sans-serif"}
            color="slategray"
            fontWeight={600}
          >
            posts
          </Text>
      </Skeleton>
    </Card>
  )

}



const Hashtag = ({hashtag, count}) => {


  const router = useRouter();
  const format = require("human-readable-numbers");



  return (
    <Card
      onPress={()=>router.push(`/hashtag/${hashtag.hashtag}`)}
      className="w-full rounded-md shadow-none my-3 h-fit p-2 flex flex-col bg-background"
      isPressable
    >
      <div className="w-full flex flex-row justify-around">
        <Text
          isTruncated={hashtag.hashtag.length>15}
          fontSize={14}
          fontWeight="600"
          className="place-self-start text-primary-500"
        >
          #{hashtag.hashtag}
        </Text>

        <Spacer />

        {hashtag.location && hashtag.location.length>0 &&
          <div
            className="w-fit flex flex-row gap-1"
          >
            <Text  
              color="lightslategrey"
              fontSize={11}
              fontFamily={"sans-serif"}
              fontWeight={600}
            >
              trending in
            </Text>
            <Text  
              fontSize={11}
              fontFamily={"sans-serif"}
              fontWeight={600}
            >
              {hashtag.location}
            </Text>
          </div>
        }

      </div>


      <Skeleton isLoaded={count} className="w-full flex flex-row gap-1 justify-start">
          <Text  
            color="lightslategrey"
            fontSize={11}
            fontFamily={"sans-serif"}
            fontWeight={600}
          >
            {count ? format.toHumanString(count.posts) : null}
          </Text>

          <Text  
            fontSize={11}
            fontFamily={"sans-serif"}
            color="slategray"
            fontWeight={600}
          >
            posts
          </Text>
      </Skeleton>
    </Card>
  )

}




const SymbolsCard = ({symbols, symbolsPostCounts, isLoading, error}) => {


  const renderSymbol = (symbol, i) => {
    return <Symbol symbol={symbol} key={symbol.id} count={symbolsPostCounts[i]} />;
  }


  return (
    <Card
      className="w-4/5 h-full max-h-[400px] border-1 shadow-none p-0 py-2 my-5 bg-background"
      isPressable={false}
    >
      <Skeleton width={"fit-content"} isLoaded={!isLoading}>
          <Chip
            color="default"
            variant="light"
            size="md"
            startContent={<FaDollarSign />}
            className="px-4 text-foreground-500 gap-0 rounded-md"
          >
            <Text fontSize={"medium"} fontWeight={600}>
              Trending
            </Text>
          </Chip>
      </Skeleton>


      <VStack
        borderTopWidth={1}
        borderRadius={0}
        marginTop={3}
        height="100%"
        width="100%"
        padding="4px"
        overflowY="scroll"
        overflowX={"hidden"}
        style={{scrollbarWidth: "none"}}
      >
        { !error 
          ?

          <Skeleton width={"100%"} height="100%" isLoaded={!isLoading}>
            {symbols && symbols.map(((s, i)=>renderSymbol(s, i)))}
          </Skeleton>


          :

          <Alert height="100%" width="100%" status="error">
            <AlertIcon />
            {error}
          </Alert>
        }

        
      </VStack>

      
    </Card>
  )
}



const HashtagsCard = ({hashtags, hashtagsPostCounts, isLoading, error}) => {


  const renderHashtag = (hashtag, i) => {
    return <Hashtag hashtag={hashtag} key={hashtag.id} count={hashtagsPostCounts[i]} />;
  }


  return (

    <Card
      className="w-4/5 h-full max-h-[400px] border-1 shadow-none p-0 py-2 bg-background"
      isPressable={false}
    >
      <Skeleton width={"fit-content"} isLoaded={!isLoading}>
          <Chip
            color="default"
            variant="light"
            size="md"
            className="px-4 text-foreground-500 gap-1 rounded-md"
            startContent={<FaHashtag />}
          >
            <Text fontSize={"medium"} fontWeight={600}>
              Trending
            </Text>
          </Chip>
      </Skeleton>

       <VStack
        borderTopWidth={1}
        borderRadius={0}
        marginTop={3}
        height="100%"
        width="100%"
        padding="4px"
        overflowY="scroll"
        overflowX={"hidden"}
        style={{scrollbarWidth: "none"}}
      >
        { !error ?

        <Skeleton 
            width={"100%"}
            height="100%" 
            isLoaded={!isLoading}
          >
          {hashtags && hashtags.map(((h, i)=>renderHashtag(h, i)))}
        </Skeleton>

          :

          <Alert height="100%" width="100%" status="error">
            <AlertIcon />
            {error}
          </Alert>

        }
      </VStack>
    </Card>
  )
}





export const RightSection = () => {

  const {

    topSymbols,
    topSymbolsError,
    topSymbolsLoading,
    topSymbolsPostsCount,

    topHashtags,
    topHashtagsError,
    topHashtagsLoading,
    topHashtagsPostsCount,

    getTopSymbols,
    getTopHashtags,


    getTopSearchQueries,
    getSimialQueries,
    insertSearchQuery
  } = useContext(RightFeedContext);



  const [queries, setQueries] = useState([]);
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [end, setEnd] = useState(false);


  useEffect(()=> {
    if(!topSymbols)
    {
      getTopSymbols();
    }

    if(!topHashtags)
    {
      getTopHashtags();
    }
  }, [!topSymbols, !topHashtags])



  useEffect(()=> {
    if(!queries.length && !end)
    {
      setSearchLoading(true);
      getTopSearchQueries().then((res)=> {
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
      getSimialQueries(query).then((res)=> {
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


  const search = () => {

    insertSearchQuery(query);

    router.push(`/explore/${query}`);
  }


  return (
      <VStack
        width="50vw"
        height="100%"
        borderLeftWidth={0}
        padding={4}
        maxW={"400px"}
        paddingTop={"3vh"}
      >
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
              router.refresh();
              window.location.replace(`/explore/${query}`)
            }
          }}
          >
            {
              (item) => renderSimilarQuery(item)
            }
        </Autocomplete>


        <SymbolsCard 
          symbols={topSymbols} 
          isLoading={topSymbolsLoading} 
          error={topSymbolsError} 
          symbolsPostCounts={topSymbolsPostsCount}
        />


        <HashtagsCard 
          hashtags={topHashtags} 
          isLoading={topHashtagsLoading}
          error={topHashtagsError}
          hashtagsPostCounts={topHashtagsPostsCount}
        />

      </VStack>
    )

}



const Sections = ({ActiveFeed, currentSelection}) => {

 
  return (
    <Stack
      className="bg-background"
      direction="row"
      height="100%"
      width={"100%"}
      overflow={"hidden"}
      spacing={0}
    >


      <Show breakpoint="(min-width: 700px)" style={{display: "none"}}>
        <LeftSection currentSelection={currentSelection} />
      </Show>

      <CenterSection ActiveFeed={ActiveFeed} />

      <Show breakpoint="(min-width: 1000px)" style={{display: "none"}}>
        <RightSection />
      </Show>
    </Stack>
  )
}


export default Sections;
