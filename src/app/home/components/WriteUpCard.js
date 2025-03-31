'use client'
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Image, Chip, Button } from "@nextui-org/react";
import { Badge, HStack, Text, VStack, Spacer, Show } from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/app/providers/AuthProvider";
import { MoreHorizontal } from "@geist-ui/icons";
import { BsDot } from '@react-icons/all-files/bs/BsDot'




export const WriteUpCard = ({writeup}) => {

  const [loading, setLoading] = useState(false);

  const { account } = useContext(AuthContext);


  const fmt = require("human-readable-numbers");

  const hdate = require("human-date");

  const router = useRouter();




  return (
    <Card
      className={`w-[50%] max-w-[330px] max-h-[400px] h-[50vh] bg-background border-0 rounded-md p-0`}
      isPressable
      onPress={()=>router.push(`/view/writeup/${writeup.id}`)}
      shadow="none"
    >
      <CardHeader
        className="flex flex-col border-1 border-b-0 justify-center h-[30vh] max-h-[300px] rounded-md p-0"
      >
        <Image
          removeWrapper
          className="object-cover"
          radius="none"
          src={writeup.thumbnail.thumbnail}
          width="100%"
          height={"100%"}
        />
      </CardHeader>


      <CardBody className="p-5 flex flex-row border-1 border-b-0 border-t-0">

        <VStack className="h-fit w-fit p-2">
          <Avatar name={writeup.author.full_name[0]} src={writeup.author.avatar} size="md" />
        </VStack>

        <VStack className="h-fit w-full gap-0 flex flex-col" gap={0}>

          <HStack
            className="w-full"
          >
            <Text
              className="text-large text-writeup font-abril max-w-[100%]"
              textOverflow={"clip"}
              noOfLines={2}
            >
              {writeup.title}
            </Text>

            <Spacer />


          </HStack>


          <HStack className="w-full">
            <Text
              className="text-xs font-semibold text-gray-500"
            >
              {writeup.author.full_name}
            </Text>
          </HStack>

        </VStack>

      </CardBody>


      <CardFooter
        className="border-1 border-t-0"
      >
        <HStack className="w-full my-0" gap={0}>
          <Text
            className="text-xs font-semibold text-gray-500"
          >
            {fmt.toHumanString(writeup.rank)} Impressions
          </Text>

          <BsDot className="text-gray-500" size={20} />

          <Text
            className="text-xs font-semibold text-gray-500"
          >
            {hdate.relativeTime(writeup.created_at)}
          </Text>

          <Spacer />

          <Button
            className="bg-background p-0 w-fit h-fit"
            size="sm"
          >
            <MoreHorizontal />
          </Button>

        </HStack>
      </CardFooter>
    </Card>
  )
}



