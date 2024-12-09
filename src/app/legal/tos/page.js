import { NavBack } from "@/app/research/components/topSection";
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
  AlertIcon
} from "@chakra-ui/react";



export const metadata = {
  "title": "Terms Of Service"
}


export const Page = async () => {
  

  const fs = require("fs");
  const path = require("path");

  const fullpath = path.join("src/app/legal/tos/", "terms.html");
  const contents = fs.readFileSync(fullpath, "utf8");


  return (  
    <div
      className="w-full bg-background flex flex-col justify-center p-2"
    >
      <div className="w-full flex flex-row justify-around">
        <div className="flex flex-col justify-center p-4">
          <NavBack home />
        </div>

        <Spacer />
        <Text
          fontSize={"xxx-large"}
          fontFamily={"sans-serif"}
          fontWeight={600}
        >
          Voidback.
        </Text>
        <Spacer />
      </div>
      <div
        className="h-full w-full flex flex-row justify-center"
        dangerouslySetInnerHTML={{__html: contents}}
      />
    </div>
  )
}

export default Page;
