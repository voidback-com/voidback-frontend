'use client'
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Card, Image, Skeleton, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Badge, HStack, Text, VStack } from "@chakra-ui/react";
import Countdown from "react-countdown";




const Page = () => {

  document.title = "Mobile App";

  const launchDate = new Date()

  launchDate.setMonth(9);


  return (
      <VStack
      background={"default"} 
      overflowX={"hidden"} 
      overflowY={"hidden"}
      width="100%" 
      maxHeight={"100vh"}
      height={"100vh"}
      direction={"row"}
      padding={10}
      className="flex flex-col bg-background"
    >
      <Card
        className="bg-background border-1 w-1/2 h-1/2 shadow-xl max-w-[400px] min-w-[300px]"
      >
      <CardHeader className="pb-0 pt-2 px-4 flex-col justify-center">
        <h4 className="font-bold text-large py-5">The Voidback Mobile App</h4>
        <small className="text-default-500 p-2">The voidback Mobile app is currently in development.</small>

      </CardHeader>

      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="logo.png"
        />
      </CardBody>

       
      </Card>

      <HStack className="py-5">
        <Text>
          App Launch Countdown: 
        </Text>
        <Badge variant={""}>
          <Countdown precision={1} date={launchDate}>
          </Countdown>
        </Badge>
      </HStack>
      
    </VStack>
      
  )

  }


export default Page;

