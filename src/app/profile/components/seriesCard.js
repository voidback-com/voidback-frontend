import { useContext, useEffect, useState } from "react";
import { HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import { MdLink } from "react-icons/md";
import { Button, Link, Skeleton, Card, CardFooter, CardBody, CardHeader } from "@nextui-org/react";
import { Folder } from "@geist-ui/icons";
import { useRouter } from "next/navigation";




const SeriesCard = ({series}) => {


  const hdate = require("human-date");

  const router = useRouter();


  return (
    <Card
      isPressable
      className="w-1/2 max-w-[300px] shadow-none border-1"
      onPress={()=>router.push(`/view/series/${series.name}`)}
    >
      <CardHeader>
        <Folder />

      </CardHeader>

      <CardBody className="w-full flex flex-row justify-center">
        <Text
          className="font-roboto text-xl"
        >
          {series.name}
        </Text>
      </CardBody>

      <CardFooter>

        <Text
          className="font-semibold text-xs text-gray-400"
        >
          published {hdate.relativeTime(series.created_at)}
        </Text>
      </CardFooter>
    </Card>
  )

}


export default SeriesCard;
