'use client'
import { 
  VStack,
  Container,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Button, useDisclosure, Divider, Modal, ModalBody, ModalHeader, ModalFooter, ModalContent, Chip } from "@nextui-org/react";
import { useState } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Filter, Search } from "@geist-ui/icons";





export const SymbolSentimentQueryCard = () => {

  const [loadingSymbols, setLoadingSymbols] = useState(false);
  const [symbols, setSymbols] = useState([]);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryResult, setQueryResult] = useState({
    ticker: "$AAPL",
    totalPosts: 129300,
    totalViews: 192304303,
    totalLikes: 920302132,
    totalDislikes: 293912,

    positiveImpressions: {"percentage": 64.2, "count": 1920231},
    negativeImpressions: {"percentage": 23.21, "count": 943021},

    positiveSentiment: {"percentage": 43.5, "count": 19322},
    negativeSentiment: {"percentage": 60.31, "count": 1293042},

    symbolPostsViewedEvents: 1029390

  });


  const renderQueryResult = () => {
    return (
      <div className="w-full h-full flex flex-col">

        {/* top section */}
        <div
          className="h-[40%] w-full bg-red-200"
        >
          <Chip 
            size="lg" 
            className="border-x-1 rounded-none bg-background p-4 h-full"
          >
            <Text 
              className="text-green-400 font-bold text-lg"
            >
            {queryResult.ticker}
            </Text>
          </Chip>
        </div>


        {/* center section */}
        <div
          className="w-full h-full bg-green-200"
        >
        </div>


        {/* bottom section */}
        <div
          className="h-full w-full bg-blue-200"
        >
        </div>

      </div>
    )
  }


  const searchSimilarSymbol = () => {

  }

  
  const renderSimilarQuery = (similarQuery) => {
    return (
      <AutocompleteItem 
        key={similarQuery.id}
        textValue={similarQuery.query}
      >
        <Text>
          {similarQuery.query}
        </Text>
      </AutocompleteItem>
    )
  }


  const filtersModal = useDisclosure();


  return (
    <div
      className="w-full h-full bg-background flex flex-col border-x-1"
    >
      
      <div
        className="p-5 w-full flex flex-row justify-around gap-4"
      >
        <Autocomplete
        isLoading={loadingSymbols}
        label="Symbol Sentiment Query"
        labelPlacement="outside"
        classNames={{
          base: "max-w-md",
          listboxWrapper: "max-h-[320px]",
          selectorButton: "text-default-500",
        }}
        defaultItems={symbols}
        className="self-start"
        inputProps={{
          classNames: {
            inputWrapper: "rounded-md border-1"
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
        aria-labelledby="symbol-query"
        placeholder="Symbol..."
        popoverProps={{
          offset: 10,
          classNames: {
            base: "rounded-large",
            content: "p-1 border-small border-default-100 bg-background",
          },
        }}
        radius="full"
        variant="bordered"
        onInputChange={searchSimilarSymbol}
        >
          {
            (item) => renderSimilarQuery(item)
          }
        </Autocomplete>


        <div className="w-fit flex flex-row self-end gap-4">
          <Button
            size="md"
            variant="bordered"
            className="rounded-md border-1"
            startContent={<Filter />}
            onPress={filtersModal.onOpen}
          >
            filters
          </Button>

          <Button
            size="md"
            variant="bordered"
            className="rounded-md border-1"
            startContent={<Search />}
          >
            search
          </Button>
        </div>

      </div>

      <Divider />


      {renderQueryResult()} 



      {/* filters Modal */}
      <Modal isOpen={filtersModal.isOpen} onOpenChange={filtersModal.onOpenChange}>
        <ModalContent>
          {(onClose)=> (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal</ModalHeader>
              <ModalBody>
                <p>
                  Sharp as a nail
                </p>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>
                  clickity click
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  )
}



export const HashtagSentimentQueryCard = () => {

  return (
    <div
      minW={"100%"} 
      overflow={"hidden"} 
      height="100vh" 
      padding={0}
      className="w-full bg-background flex flex-col border-x-1"
    >
    </div>
  )
}



export const KeywordSentimentQueryCard = () => {

  return (
    <div
      minW={"100%"} 
      overflow={"hidden"} 
      height="100vh" 
      padding={0}
      className="w-full bg-background flex flex-col border-x-1"
    >
    </div>
  )
}


