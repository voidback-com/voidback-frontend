'use client'
import { errorToReadable } from "@/app/configs/api";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import { HStack, useToast, Wrap, WrapItem, VStack, Text, IconButton, Spacer, Link } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Spinner, Image, Chip } from "@nextui-org/react";
import { DataHubContext } from "@/app/providers/DataHubProvider";
import { Download } from "@geist-ui/icons";
import { formatBytes } from "@/app/globalComponents/Formatters";
import MarkdownPreview from "@uiw/react-markdown-preview";



const Page = ({ params }) => {

  const { id } = params;

  const { getDataset,  getDatasetFilesInfo } = useContext(DataHubContext);

  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState(null);


  const [filesInfo, setFilesInfo] = useState(null);
  const [fetched, setFetched] = useState(false);


  const fetchFilesInfo = async () => {
    const response = await getDatasetFilesInfo(id);

    const data = await response.json();

    if(response.status===200)
    {
      setFilesInfo(data);
    }

    setFetched(true);
  }



  useEffect(()=> {
    if(!filesInfo && !fetched)
    {
      fetchFilesInfo();
    }
  }, [!filesInfo])



  const toast = useToast();


  const fetchDataset = async () => {

    setLoading(true);

    const response = await getDataset(id);

    const data = await response.json();

    if(response.status==200)
    {
      setDataset(data);
    }

    else{
      toast({
        title: "Failed to fetch the dataset!",
        description: errorToReadable(data),
        duration: 4000,
        status: "error"
      });
    }

    setLoading(false);
  }


  useEffect(()=> {
    if(!loading)
      fetchDataset();
  }, [!dataset])


  document.title = "Dataset";

  if(loading || !dataset)
  {
    return (
      <VStack className="w-full h-full bg-background">
        <HStack className="w-full justify-center">
          <Spinner color="default" size="lg" />
        </HStack>
      </VStack>
    )
  }


  const hdate = require("human-date");
  const human = require("human-readable-numbers");


  return (
    <HStack
      className="w-full h-full bg-background overflow-y-scroll"
    >
     <VStack
      className="w-full h-[100vh] bg-background"
    >

        <HStack className="w-full p-4">
          <NavBack />

        </HStack>

        <HStack className="w-full p-4 justify-center">
          <Text 
            className="font-semibold"
            fontFamily={"sans-serif"}
            fontSize="xxx-large"
          >
            {dataset.name}
          </Text>
        </HStack>

        
        <HStack className="w-full p-4 justify-center">
          <Image
            src={dataset.thumbnail.image}
            className="w-2/3 max-w-[300px] object-cover rounded-sm"
            removeWrapper
          />

        </HStack>

        <HStack className="w-full justify-center">
          <Text
            className="text-default-500"
            fontWeight={500}
            fontSize="small"
          >
            By {dataset.author.full_name}
          </Text>


          <Link href={`/view/account/${dataset.author.username}`}>
            <Text
              className="text-default-500"
              fontWeight={600}
              fontSize="small"
            >
              @{dataset.author.username}
            </Text>
          </Link>
        </HStack>


        <HStack className="justify-center">
          <Text
            className="text-default-500"
            fontWeight={500}
            fontSize="smaller"
          >
            {formatBytes(dataset.total_size)}
          </Text>


          <Spacer />


          {filesInfo &&
          <Text
            className="text-default-500"
            fontWeight={500}
            fontSize="smaller"
          >
            Total Files {filesInfo.total_files}
          </Text>
          }
        </HStack>

        <HStack className="justify-start">
          <Text
            className="text-default-500"
            fontWeight={500}
            fontSize="smaller"
          >
            models trained {human.toHumanString(dataset.models_trained)}
          </Text>

          <Spacer />

          <Text
            className="text-default-500"
            fontWeight={500}
            fontSize="smaller"
          >
            downloads {human.toHumanString(dataset.downloads)}
          </Text>



        </HStack>

        <HStack>

            <Text
              className="text-default-500"
              fontWeight={600}
              fontSize="x-small"
            >
              created on {hdate.prettyPrint(dataset.updated_at)}
            </Text>

            <Spacer />

            <Text
              className="text-default-500"
              fontWeight={600}
              fontSize="x-small"
            >
              last updated {hdate.relativeTime(dataset.updated_at)}
            </Text>


        </HStack>




        <HStack className="w-full justify-center my-2 pb-2">
          {filesInfo && filesInfo.types.length &&
          <Wrap
            className="w-fit border-1 p-1 rounded-md"
          >
            {filesInfo.types.map((ft, i)=> {
                return (
                  <WrapItem>
                    <Text
                      className="font-semibold text-default-600"
                    >
                      {ft.file_type}
                      {i+1 < filesInfo.types.length ? "," :""}
                    </Text>
                  </WrapItem>
                )
              })}
          </Wrap>
          }
        </HStack>


        <VStack className="p-4">
          <HStack className="w-full justify-start">
            <Text
              fontSize={"larger"}
              fontWeight={600}
            >
              Categories
            </Text>
          </HStack>


          <Wrap className="w-full border-0 p-5 rounded-md">
            {dataset.categories.map((category)=> {
              return <Chip size={"sm"} variant="bordered" className="border-1">{category.category}</Chip>
            })}
          </Wrap>

        </VStack>



      </VStack>


      <VStack
        className="w-full h-[100vh]"
      >
        <HStack className="w-full p-4 justify-end ml-2">
          <IconButton icon={<Download />} background="default" />
        </HStack>



        <VStack className="w-full p-4">
          <HStack className="w-full justify-start">
            <Text
              fontSize={"larger"}
              fontWeight={600}
            >
              Description
            </Text>
          </HStack>
          <MarkdownPreview 
            style={{backgroundColor: "transparent"}}
            className="p-4 rounded-md w-full border-1"
            source={dataset.description} 
          />
        </VStack>

        <VStack className="w-full p-4">
          <HStack className="w-full justify-start">
            <Text
              fontSize={"larger"}
              fontWeight={600}
            >
              Credit
            </Text>
          </HStack>
          <MarkdownPreview 
            style={{backgroundColor: "transparent"}}
            className="p-4 rounded-md w-full border-1"
            source={dataset.credit_sources} 
          />
        </VStack>


      </VStack>
    </HStack>
  )

  }


export default Page;
