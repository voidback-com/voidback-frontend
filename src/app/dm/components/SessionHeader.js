import { IconButton, Spacer, VStack } from "@chakra-ui/react"
import { Archive, PlusSquare, Search, Settings } from "@geist-ui/icons"
import { Button, Autocomplete, AutocompleteItem, Input } from "@nextui-org/react"
import { RiChatNewFill } from "@react-icons/all-files/ri/RiChatNewFill"



export const SessionHeader = () => {


  return (
    <div className="w-full my-5 min-w-[400px] h-[5vh] border-0 rounded-lg place-self-center flex flex-row">

      <VStack className="h-full flex flex-col justify-center px-4">
        <IconButton
          className="p-2"
          size={"xs"}
          as={Archive}
        />
      </VStack>

      <Autocomplete
        size="md"
        className="w-[80%] py-1"
        placeholder="Search Direct Messages"
        startContent={<Search />}
      >
      
      </Autocomplete>

      <Spacer />

      <VStack className="h-full flex flex-col justify-center px-4">
        <IconButton
          className="p-2"
          size={"xs"}
          as={PlusSquare}
        />
      </VStack>
    </div>
  )
}
