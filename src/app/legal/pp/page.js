"use client"
import { NavBack } from "@/app/globalComponents/buttonFunctions";
import { 
    HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";





const Page = () => {
  
  document.title = "Privacy Policy";


  return (  
    <VStack className="bg-background p-5">
        <div classNameName="w-full flex flex-row justify-around">
          <div classNameName="flex flex-col justify-center p-4">
            <NavBack home />
          </div>

        <HStack className="w-full justify-center">
          <Text
            fontSize={"xxx-large"}
            fontFamily={"sans-serif"}
            fontWeight={600}
          >
            Voidback.
          </Text>
          </HStack>


  <div className="place-self-center w-[80%] overflow-y-scroll">

      <div className="my-10 flex flex-col gap-2">
        <h1 className="font-bold">Privacy Policy</h1>

        <p>This Privacy Policy outlines how Voidback collects, uses, and protects your personal information.</p>
      </div>


      <div className="my-10 flex flex-col gap-2">
        <h2 className="font-bold py-2">Information We Collect</h2>
        <p className="font-bold">We may collect the following information:</p>
        <ul  className="px-10 list-disc">
            <li>Name</li>
            <li>Email address</li>
            <li>Birth date</li>
            <li>Other relevant information</li>
        </ul>
      </div>


      <div className="flex flex-col gap-2 my-10">
        <h2 className="font-bold">How We Use Your Information</h2>
        <p className="font-bold">We use your information to:</p>
        <ul  className="px-10 list-disc">
            <li>Process your requests and inquiries</li>
            <li>Improve our services</li>
        </ul>
      </div>

      <div className="flex flex-col gap-2 my-10">
        <h2 className="font-bold">Data Security</h2>
        <p>We implement security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.</p>
      </div>


      <div className="my-10 flex flex-col gap-2">
        <h2 className="font-bold">Your Rights</h2>
        <p className="font-bold py-2">You have the right to:</p>


        <ul  className="px-10 list-disc">
            <li className="">Access your personal information</li>
            <li>Correct any inaccuracies</li>
            <li>Request erasure of your data</li>
        </ul>
      </div>

      <div className="my-10 flex flex-col gap-2">
      <h2 className="font-bold">Contact Us</h2>
      <p>If you have any questions or concerns about this Privacy Policy, please contact us at support@voidback.com.</p>
      </div>

    <p>This Privacy Policy is effective as of 01/12/2024. We may update this policy from time to time, so please review it periodically.</p>
    <br/>

        </div>
      </div>
  </VStack>

  )
}

export default Page;
