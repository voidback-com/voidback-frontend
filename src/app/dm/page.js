'use client'
import { Center, Container, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";



const Page = () => {

  document.title = "Direct Message";

  return (
    <Container 
      minW={"100%"} 
      overflow={"hidden"} 
      height="100vh" 
      padding={0}
      className="bg-background flex flex-col"
    >
      <Center>
        <Text>
          Under Development
        </Text>
      </Center>
    </Container>
  )
}



export default Page;
