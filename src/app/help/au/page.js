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
import { AiOutlineRedo } from "@react-icons/all-files/ai/AiOutlineRedo";
import { NavBack } from "@/app/research/components/topSection";
import { Github } from "@geist-ui/icons";




const Page = () => {


  return (
    <div
      className="w-full h-[100vh] bg-background flex flex-col p-4 gap-10"
    >

      <div className="w-full flex flex-row">
        
        <div className="absolute flex flex-col justify-center p-4">
          <NavBack />
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


      <HStack className="w-fit self-center my-10">

        <Text className="self-center">
          Contribute to our: 
        </Text>

        <Button
          size="lg"
          variant="bordered"
          className="w-fit"
          onPress={()=>window.location.assign("https://github.com/uvert2024/Voidback-frontend")}
        >
          <HStack>
            <Text>Frontend</Text>
            <Spacer />
            <Github />
          </HStack>
        </Button>

        <Text className="self-center">
          AND / OR
        </Text>

        <Button
          size="lg"
          variant="bordered"
          className="w-fit"
          onPress={()=>window.location.assign("https://github.com/uvert2024/Voidback-backend")}
        >
          <HStack>
            <Text>Backend</Text>
            <Spacer />
            <Github />
          </HStack>
        </Button>
      </HStack>



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
            className="w-fit bg-background max-w-[600px] h-full shadow-none"
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


          <Card
            className="w-fit bg-background max-w-[600px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
                Voidback: Transparency and Community Power
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
                Voidback is more than just a platform; it's a community-driven initiative that champions transparency and open collaboration. By making its source code fully accessible on GitHub, Voidback empowers its users to understand the intricacies of its operations and contribute to its ongoing development. This level of transparency fosters trust and ensures that the platform's algorithms are unbiased and ethical.
              </Text>

            </CardBody>

          </Card>

        </HStack>

      </VStack>


   </div>
  )
}



export default Page;
