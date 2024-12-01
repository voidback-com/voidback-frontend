'use client'
import { useState, useContext, useEffect } from "react";
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Divider, Image } from "@nextui-org/react";
import { HStack, Show, Spacer, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";



const Page = () => {

  const router = useRouter();

  if(!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i))
    return router.replace("/home/foryou");


  return (
    <div className="w-full h-[100%] bg-background p-10">
      <h1
      >
        Dear user,
          we don't yet have an app for you and the site is not optimized for mobile devices.
      </h1>

       <Card className="col-span-12 sm:col-span-4 h-[300px] border-1 my-5">

        <CardBody className="h-full w-full bg-background">
          <Image
            removeWrapper
            alt="Card background"
            className="z-0 w-full h-full object-cover"
            src="logo.png"
          />
        </CardBody>

        <CardFooter className="bg-background border-1">
          <h4 className="text-white font-medium text-medium font-family-mono-space">The Voidback mobile app is on it's way.</h4>
        </CardFooter>

        </Card>
    </div>
  )

}


export default Page;
