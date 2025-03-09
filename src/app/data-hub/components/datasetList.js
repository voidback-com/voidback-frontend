'use client'
import { HStack, Skeleton, VStack, Spacer, Text, useToast, Show, Wrap, WrapItem } from "@chakra-ui/react";
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { ChevronLeft, ChevronRight, LogIn, Plus, Search, Trash, X } from "@geist-ui/icons";
import { Autocomplete, Spinner, Button, useDisclosure, Card, Pagination, CardHeader, CardBody, CardFooter, Input, Textarea, Checkbox, AutocompleteItem, Avatar } from "@nextui-org/react";
import { AuthContext } from "@/app/providers/AuthProvider";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import { useRouter } from "next/navigation";
import { DatasetCard } from "./DatasetCard";





export const DatasetList = ({ loading, pagesEnd, datasets, page, nextPage, previousPage }) => {

  const router = useRouter();



  return (
    <VStack className="w-full h-full">
      <HStack className="w-full p-4 bg-background">
        <Skeleton className="w-fit h-fit" isLoaded={!loading}>
          <Button
            onPress={previousPage}
            isDisabled={page===1}
            color="default"
            variant="bordered"
            className="border-1 rounded-sm"
            size="sm"
          >
            <ChevronLeft />
          </Button>
        </Skeleton>

        <Spacer />

        <Skeleton className="w-fit h-fit" isLoaded={!loading}>
          <Button
            color="default"
            variant="bordered"
            className="border-1 rounded-sm"
            size="sm"
            onPress={nextPage}
            isDisabled={pagesEnd}
          >
            <ChevronRight />
          </Button>
        </Skeleton>
      </HStack>


      <Wrap
        className="w-full h-full overflow-y-scroll p-5"
        spacing={5}
      >
        {
          datasets && datasets.length

          ?
            datasets.map((dataset)=> {
              return <WrapItem className="w-fit h-fit"><DatasetCard dataset={dataset} /></WrapItem>;
            })

          :
            null
        }
      </Wrap>
    </VStack>
  )
}




