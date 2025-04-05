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
      className="w-full min-h-[100vh] bg-background flex flex-col p-10 gap-10 overflow-y-scroll justify-center place-items-center"
      itemScope
      itemType="https://schema.org/AboutPage"
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

      <HStack>
          <Card
            className="w-fit bg-background max-w-[400px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
                About Voidback
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
                Voidback is a platform designed for you to read and write your own content. Think of your writings as "write ups," which are essentially blog posts you can create and organize under categories that interest you.
              </Text>
            </CardBody>
          </Card>


          <Card
            className="w-fit bg-background max-w-[400px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
                Introducing Series
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
Beyond individual write ups, you can also create "series." A series is like a playlist, but instead of songs, it's a collection of your related write ups, allowing readers to follow a theme or story.
              </Text>
            </CardBody>
          </Card>
      </HStack>


      <HStack>
          <Card
            className="w-fit bg-background max-w-[400px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
              Our Core Problem & Solution
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >

We noticed that there isn't one go-to platform that everyone associates with reading and writing online. Our aim is to become that single, central place for readers and writers alike.

              </Text>

            </CardBody>
          </Card>

          <Card
            className="w-fit bg-background max-w-[400px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
                Built for You: Readers and Writers
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
Voidback is built for both readers and writers. We offer an intuitive editor that feels familiar, much like the word processors you're already comfortable with, such as Word or Google Docs.

              </Text>

            </CardBody>
          </Card>

        </HStack>


      <HStack>
          <Card
            className="w-fit bg-background max-w-[400px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
                Our Big Picture Vision
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
Our larger goal is to make learning through write ups easier and more engaging. We want to achieve this by allowing the inclusion of images, videos, and referencing within your content.
              </Text>

            </CardBody>
          </Card>

          <Card
            className="w-fit bg-background max-w-[400px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
                What You'll Find on Voidback
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
On our platform, you'll discover news, opportunities to learn new skills, and a wealth of pure, unfiltered knowledge and information across various topics.
              </Text>

            </CardBody>
          </Card>

        </HStack>


      <HStack>
          <Card
            className="w-fit bg-background max-w-[400px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
                Empowering Knowledge Sharing
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
At its heart, Voidback is driven by the fundamental belief in the power of freely shared knowledge. We envision a space where the exchange of ideas and information is unhindered, allowing individuals from all walks of life to both contribute their unique perspectives and absorb the collective wisdom of others. Our platform is designed to empower everyone – from seasoned experts to curious learners – to actively participate in this dynamic ecosystem of knowledge. 
              </Text>

            </CardBody>
          </Card>


          <Card
            className="w-fit bg-background max-w-[400px] h-full shadow-none"
          >
            <CardHeader>
              <Text
                fontSize={"large"}
                fontWeight={600}
                fontFamily={"sans-serif"}
              >
              Our Commitment to Freedom of Expression
              </Text>
            </CardHeader>

            <CardBody className="h-full">
              <Text
                fontFamily={"sans-serif"}
                fontSize={"medium"}
              >
              At Voidback, we deeply value freedom of speech and unfiltered access to information. Our core values are built on allowing users complete freedom to express themselves and share their views as they see fit, provided they do not violate any applicable laws or regulations. While Voidback provides the platform, users are solely responsible for their content, and Voidback will not proactively censor or prevent the expression of any particular viewpoints.
              </Text>

            </CardBody>
          </Card>


        </HStack>

   </div>
  )
}



export default Page;
