'use client'
import { errorToReadable } from "@/app/configs/api";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import { CategoryInput } from "@/app/globalComponents/CategoryInput";
import { DataHubContext } from "@/app/providers/DataHubProvider";
import { HStack, VStack, Wrap, Text, Spacer, useToast } from "@chakra-ui/react";
import { Image } from "@geist-ui/icons";
import { Input, Textarea, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { useFileUpload } from "use-file-upload";




const Page = () => {

  document.title = "New Dataset";


  const { createDataset } = useContext(DataHubContext);


  const [name, setName] = useState('');
  const [thumbnail, selectThumbnail] = useFileUpload();
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [creditSources, setCreditSources] = useState('');


  const toast = useToast();

  const router = useRouter();


  const handleCreate = async () => {
    const response = await createDataset(name, thumbnail, description, categories, creditSources);


    const data = await response.json();

    if(response.status==200)
    {
      localStorage.setItem("activeDataset", JSON.stringify(data));
      router.push(`/data-hub/newDataset/files`);
    }
    else{
      toast({
        title: "Error creating a new dataset",
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      });
    }
  }


  return (
    <VStack
      className="w-full min-h-[100vh] p-10 bg-background overflow-y-scroll"
      gap={2}
    >
      <HStack className="w-full flex flex-row">
        <NavBack />
      </HStack>

      <HStack
        className="w-full flex flex-row justify-center my-10"
      >
        <Input
          label="Name"
          placeholder="Name"
          isRequired
          className="w-1/2 max-w-[400px] font-semibold"
          onChange={(e)=>setName(e.target.value)}
        />
      </HStack>

      <HStack
        className="w-full flex flex-row justify-center my-10"
      >
        <Button
          onPress={()=>selectThumbnail({"accept": "image/*", multiple: false})}
          isRequired
          className="w-1/2 max-w-[400px] font-semibold"
          endContent={<Image />}
        >
          {thumbnail?
            thumbnail.name
          :
          "select thumbnail"
          }
        </Button>
      </HStack>



      <HStack
        className="w-full flex flex-row justify-center my-10"
      >
        <Textarea 
          isMultiline
          multiple
          onChange={(e)=>setDescription(e.target.value)} 
          value={description}
          isRequired 
          maxRows={30}
          label="Describe Your Dataset" 
          placeholder="description (markdown supported)..." 
          className="w-full max-w-[500px] font-semibold"
        />

      </HStack>


      <HStack
        className="w-full flex flex-row justify-center"
      >
        <HStack className="min-w-[350px] w-full max-w-[500px] font-semibold">
          <CategoryInput setCategories={setCategories} categories={categories} hideBorder />
        </HStack>

      </HStack>



      <HStack
        className="w-full flex flex-row justify-center my-10"
      >
        <Textarea 
          isMultiline
          multiple
          onChange={(e)=>setCreditSources(e.target.value)} 
          value={creditSources}
          maxRows={30}
          label="Give Credit To Sources (Optional)" 
          placeholder="Give credit (markdown supported)..." 
          className="w-full max-w-[500px] font-semibold"
        />

      </HStack>




      <HStack className="w-full justify-end">
        <Button
          variant="bordered"
          className="border-1 font-semibold"
          size="md"
          onPress={()=>handleCreate()}
        >
          next
        </Button>
      </HStack>

    </VStack>
  )

  }


export default Page;
