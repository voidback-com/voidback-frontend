import { IconButton, Spacer, VStack } from "@chakra-ui/react"
import { Archive, PlusSquare, Search } from "@geist-ui/icons"
import { Autocomplete } from "@nextui-org/react"


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
        placeholder="Search for a conversation..."
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
