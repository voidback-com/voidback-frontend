'use client'
import { errorToReadable } from "@/app/configs/api";
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import { CategoryInput } from "@/app/globalComponents/CategoryInput";
import { DataHubContext } from "@/app/providers/DataHubProvider";
import { HStack, VStack, Wrap, Text, Spacer, useToast } from "@chakra-ui/react";
import { File as FileIcon, Image as ImageIcon } from "@geist-ui/icons";
import { style } from "@mui/system";
import { Input, Textarea, Progress, Button, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState, useContext, useEffect } from "react";
import { useFileUpload } from "use-file-upload";




const Page = () => {

  document.title = "New Dataset (Files)";


  const { createDatasetFile } = useContext(DataHubContext);

  const [files, selectFiles] = useFileUpload();
  const [uploads, setUploads] = useState(0);
  const [uploading, setUploading] = useState(false);


  const toast = useToast();


  const router = useRouter();


  const getActiveDataset = () => {
    const dat = JSON.parse(localStorage.getItem("activeDataset"));
    return dat;
  }


  useEffect(()=> {
    if(!getActiveDataset())
    {
      router.push('/data-hub/newDataset');
    }
  }, [])


  const handleUploads = async () => {
    setUploading(true);

    files.map(async (file)=> {
      const response = await createDatasetFile(file, getActiveDataset().id);

      const data = await response.json();

      if(response.status==200)
      {
        setUploads(p=>p+1);
      }
      
      else{
       toast({
          title: `Error uploading file!`,
          duration: 4000,
          status: "error",
          description: errorToReadable(data)
        });

      }

    })
  }


  useEffect(()=> {
    if(uploading && uploads===files.length)
    {
      setUploading(false);
      toast({
        title: "Successfully uploaded all the files",
        duration: 4000,
        status: "success"
      });

      router.push("/data-hub");

    }
  }, [uploads, uploading])



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
        <VStack className="w-fit">

          <HStack className="w-full flex flex-row justify-center">
            <Text
              fontFamily={"sans-serif"}
              className="font-semibold text-xl pb-10"
            >

              {getActiveDataset() ?
              getActiveDataset().name : null}
            </Text>
          </HStack>

            <HStack className="w-full flex flex-row justify-center">
              {getActiveDataset()?

                <Image
                  src={getActiveDataset().thumbnail.image}
                  className="w-1/2 h-1/2 object-contain"
                  removeWrapper
                />


              :
              null
              }
            </HStack>

        </VStack>

      </HStack>


      <HStack>
        {
          files && !uploading
          ?
            <Text
              fontSize={"medium"}
              fontWeight={600}
            >
              selected {files.length} files
            </Text>
          :
          null
        }
      </HStack>

      <HStack className="w-full flex flex-row justify-center">
        <Button
          variant="bordered"
          className="border-1 w-1/2 max-w-[400px]"
          endContent={<FileIcon />}
          onPress={()=>selectFiles({"multiple": true})}
          isDisabled={uploading}
        >
          Select Files
        </Button>
      </HStack>




      <HStack className="w-full my-10 justify-between">

        <Spacer />
        {
          uploading && files
          ?
            <>
            <Progress
              className="max-w-lg font-semibold"
              color="success"
              showValueLabel={true}
              value={uploads > 0 ? (uploads/files.length)*100 : 0}
              label={`Upload Progress: ${uploads}/${files.length}`}
            />
        <Spacer />
            </>
          :
          null
        }


        <Button
          variant="bordered"
          className="border-1 font-semibold"
          size="md"
          isDisabled={!files}
          onPress={()=>handleUploads()}
        >
          upload
        </Button>
      </HStack>

    </VStack>
  )

  }


export default Page;
