'use client'
import { HStack, VStack, Spacer, Text, Wrap, useToast, Show, IconButton, WrapItem } from "@chakra-ui/react";
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { Download, LogIn, MoreVertical, Plus, Search, Trash, X } from "@geist-ui/icons";
import { Autocomplete, Spinner, Image, Button, useDisclosure, Card, CardHeader, CardBody, CardFooter, Chip, Input, Textarea, Checkbox, AutocompleteItem, Avatar } from "@nextui-org/react";
import { AuthContext } from "@/app/providers/AuthProvider";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import { useRouter } from "next/navigation";
import { BsDot } from "@react-icons/all-files/bs/BsDot"
import { formatBytes } from "@/app/globalComponents/Formatters";
import { DataHubContext } from "@/app/providers/DataHubProvider";





export const DatasetCard = ({ dataset }) => {


  const { account } = useContext(AuthContext);

  const { getDatasetFilesInfo } = useContext(DataHubContext);


  const [loading, setLoading] = useState(false);

  const [filesInfo, setFilesInfo] = useState(null);
  const [fetched, setFetched] = useState(false);


  const fetchFilesInfo = async () => {
    const response = await getDatasetFilesInfo(dataset.id);

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



  const router = useRouter();

  const toast = useToast();
  const hdate = require("human-date");



  return (
    <Card
      isPressable
      shadow="none"
      radius="lg"
      onPress={()=>router.push(`data-hub/view/${dataset.id}`)}
      className="border-1 bg-background w-[300px] h-[400px] border-1 rounded-xl"
    >
      <CardHeader className="w-full p-0 flex flex-row justify-center">

        <Image
          src={dataset.thumbnail.image}
          className="w-full h-[200px] object-cover rounded-sm"
          removeWrapper
        />

      </CardHeader>

      <CardBody>
        <VStack className="w-full h-full">


          <HStack className="w-full">
            <Text 
              className="font-semibold"
              fontFamily={"sans-serif"}
              fontSize="larger"
            >
              {dataset.name}
            </Text>
          </HStack>

          <HStack className="w-full">
            <Text
              className="text-default-500"
              fontWeight={500}
              fontSize="small"
            >
              By {dataset.author.full_name}
            </Text>
          </HStack>



          <HStack className="w-full">
            <Text
              className="text-default-500"
              fontWeight={600}
              fontSize="x-small"
            >
              @{dataset.author.username}
            </Text>

            <BsDot color="grey" />

            <Text
              className="text-default-500"
              fontWeight={600}
              fontSize="x-small"
            >
              last updated {hdate.relativeTime(dataset.updated_at)}
            </Text>


          </HStack>


          <HStack className="w-full">
            <Text
              className="text-default-500"
              fontWeight={500}
              fontSize="smaller"
            >
              {formatBytes(dataset.total_size)}
            </Text>


            <BsDot color="grey" />


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


          <HStack className="w-full my-2 pb-2">
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


        </VStack>
      </CardBody>


    </Card>
  )
}




