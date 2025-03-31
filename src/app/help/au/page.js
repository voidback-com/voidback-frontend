'use client'
import { useContext, useRef, useState } from "react";
import { 
  VStack,
  Stack,
  Spacer,
  HStack,
  Text,
} from "@chakra-ui/react";
import { errorToReadable } from "@/app/configs/api";
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Spinner } from "@nextui-org/react";
import { NavBack } from "@/app/globalComponents/buttonFunctions";




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
                A Data-Driven Machine Learning Future
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
Voidback is a platform that offers "edge rooms," enabling users to cultivate vibrant communities. Each edge room serves as a distinct community space. Furthermore, with our groundbreaking new feature, ML-Hub (Machine Learning Hub), users can train machine learning models directly within their browsers. ML-Hub provides access to diverse datasets available on Voidback, empowering users to build state-of-the-art models from their own devices, leveraging their contributions and the collective knowledge of the Voidback community.
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
