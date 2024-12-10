'use client'
import { 
  Spacer,
  HStack,
  Text,
  Skeleton,
  VStack,
  Show
} from "@chakra-ui/react";
import { API_URL, toAuthHeaders, WS_ANALYTICS } from "@/app/configs/api";
import { useEffect, useState, useContext } from "react";
import { 
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Flag, Lock, LogIn, LogOut, Unlock, UserMinus, UserPlus, Users } from "@geist-ui/icons";
import { AutoAwesomeMosaicTwoTone } from "@mui/icons-material";


const ICONS = {
  "login": <LogIn size={30} color="lightgreen" />,
  "logout": <LogOut size={30} color="tomato" />,
  "deleted-account": <UserMinus size={30} color="tomato" />,
  "otp": <Lock size={30} color="mediumpurple" />,
  "otp-verified": <Unlock size={30} color="lightgreen" />,
  "follows": <UserPlus size={30} color="lightgreen" />,
  "reports": <Flag size={30} color="tomato" />
};


export const StatusCard = ({number, description, icon}) => {

  const format = require("human-readable-numbers");


  return (
    <Card
      className="bg-background border-1 w-[250px] h-fit"
    >
      <CardHeader className="flex flex-col justify-around place-items-center">
        {ICONS[icon]}
      </CardHeader>

      <CardBody className="flex flex-col justify-around place-items-center">
        <HStack className="w-fit p-0">
          <Text
            fontSize="medium"
            fontWeight={600}
          >
            {format.toHumanString(number)}
          </Text>
          <Text
            fontSize="medium"
          >
            {number===1?"event":"events"}
          </Text>
        </HStack>
      </CardBody>

      <CardFooter className="flex flex-col justify-around place-items-center">
        <Text
          fontSize={"small"}
          fontWeight={500}
          fontFamily="sans-serif"
        >
          {description}
        </Text>
      </CardFooter>
    </Card>
  )
}




export const Countries = ({countries}) => {


  if(!countries || !countries.length)
    return <></>;

  return (
    <Card
      className="bg-background border-1 h-full flex flex-col justify-around place-items-center w-[250px]"
    >
      <Chip className="bg-background border-1 rounded-md p-2 my-2">Countries</Chip>
      <div
      className="flex flex-col justify-around place-items-center h-full gap-2 border-t-1 w-full overflow-y-scroll"
      >
        {
          countries.map(({country}, i)=> {
            return <Chip variant="light" className="border-b-1 rounded-none p-2">
              <Text
                key={i}
                fontFamily="sans-serif"
                fontSize={"medium"}
                fontWeight={600}
              >{country}</Text></Chip>
          })
        }
      </div>
    </Card>
  )
}



export const Cities = ({cities}) => {


  if(!cities || !cities.length)
    return <></>;



  return (
    <Card
      className="bg-background border-1 h-full flex flex-col justify-around place-items-center w-[250px] relative top-10"
    >
      <Chip className="bg-background border-1 rounded-md p-2 my-2">Cities</Chip>
      <div
      className="flex flex-col justify-around place-items-center gap-2 border-t-1 w-full overflow-y-scroll h-full"
      >
        {
          cities.map(({city}, i)=> {
            return <Chip variant="light" className="border-b-1 rounded-none p-2">
              <Text
                key={i}
                fontFamily="sans-serif"
                fontSize={"medium"}
                fontWeight={600}
              >{city}</Text></Chip>
          })
        }
      </div>
    </Card>
  )
}


