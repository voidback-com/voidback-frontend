'use client'
import { HStack, VStack, Spacer, Text, useToast, Show } from "@chakra-ui/react";
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
import { useRouter } from "next/navigation";





export const Topbar = ({ setDatasets, setQuery, query, searchLoading }) => {


  const { account } = useContext(AuthContext);



  const router = useRouter();

  const toast = useToast();



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
      <Show breakpoint="(min-width: 1000px)">
        <NavBack />
      </Show>

      <Show breakpoint="(min-width: 1000px)">
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

      </Show>


      <Spacer />
      <Autocomplete
        isLoading={searchLoading}
        classNames={{
          base: "max-w-md",
          listboxWrapper: "max-h-[320px]",
          selectorButton: "text-default-500",
        }}
        defaultItems={[]}
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
        onInputChange={()=>null}
        menuTrigger="input"
        onKeyDown={(k)=> {
          if(k.key==="Enter")
          {
            // none
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
        size="sm"
        className="border-1 font-semibold"
        variant="bordered"
        color="default"
        endContent={<Plus />}
        onPress={()=>router.push(`/data-hub/newDataset`)}
      >
        New Dataset
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
  )
}




