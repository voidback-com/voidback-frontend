'use client'
import { 
  Spacer,
  HStack,
  Text,
  Skeleton,
  VStack,
  Show
} from "@chakra-ui/react";
import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Users } from "@geist-ui/icons";



export const UsersActivity = () => {

  const [devices, setDevices] = useState({
  });

  const [browsers, setBrowsers] = useState({});

  const [routes, setRoutes] = useState([]);


  return <div></div>;
}



export const PositiveEvents = () => {
  return <div></div>;
}




export const NegativeEvents = () => {
  return <div></div>;
}


export const NeutralEvents = () => {
  return <div></div>;
}


