'use client'
import { LeftSection, RightSection } from "@/app/home/components/Sections";
import { useContext, useRef, useState } from "react";
import { 
  VStack,
  Stack,
  Spacer,
  HStack,
  Text,
  Skeleton,
  useColorMode,
  useDisclosure,
  Alert,
  Show,
  AlertIcon,
  useColorModeValue
} from "@chakra-ui/react";
import { errorToReadable } from "@/app/configs/api";
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Spinner } from "@nextui-org/react";
import { NavBack } from "@/app/research/components/topSection";




const Page = () => {

  document.title = "About Us";

  return (
    <div
      className="w-full h-[100vh] bg-background flex flex-col p-10 gap-10"
    >

      <div className="w-full flex flex-row">
        
        <div className="absolute flex flex-col justify-center p-4">
          <NavBack home />
        </div>

        <Spacer />

        <div className="flex flex-col">
          <Text
            fontSize={"xxx-large"}
            fontFamily={"sans-serif"}
            fontWeight={600}
          >
            Voidback.
          </Text>
        </div>
        <Spacer />
      </div>

      <Spacer />

      <VStack
        className="w-full overflow-y-scroll flex flex-col space-y-10"
        overflowY={"scroll"}
      >
        <HStack>
          <Card
            className="w-fit bg-background max-w-[600px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
                Voidback: Harnessing the Power of Collective Sentiment
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
                Voidback is a pioneering platform that leverages the power of artificial intelligence to analyze and interpret the collective sentiment expressed within its community. By mining the wealth of information shared by its users, Voidback is able to extract valuable insights that can inform investment decisions and improve overall financial outcomes.
              </Text>
            </CardBody>
          </Card>


          <Card
            className="w-fit bg-background max-w-[600px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
                Empowering Informed Decision-Making
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
                Voidback empowers its users by providing them with access to a wealth of sentiment-driven insights. By understanding the prevailing mood of the market, investors can make more informed decisions, mitigate risks, and optimize their portfolios. Whether you're a seasoned investor or a novice trader, Voidback's data-driven approach can help you navigate the complexities of the financial world with greater confidence.
              </Text>
            </CardBody>
          </Card>
      </HStack>


      <HStack>
          <Card
            className="w-fit bg-background max-w-[1200px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
                A Data-Driven Future
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
                To further enhance the value it offers, Voidback is introducing a groundbreaking feature: the Data Hub. This powerful tool will provide subscribers with direct access to a vast repository of sentiment data, enabling them to perform complex queries and extract deeper insights. By leveraging this data, institutions can make more informed and strategic decisions, reducing risk and maximizing returns.
              </Text>

            </CardBody>
          </Card>

        </HStack>

      </VStack>

      <Spacer />
      <Spacer />


   </div>
  )
}



export default Page;
