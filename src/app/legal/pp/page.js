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


export const metdata = {
  title: "Privacy Policy",
  description: "Voidback's privacy policy page.",
  referrer: "origin-when-cross-origin",
  keywords: ["finance", "quant", "voidback", "social media", "platform", "voidback login", "fintech", "data-hub", "data broker", "financial data", "realtime data", "stocks", "options", "stock market", "investments", "models", "quantitative analysis"]
}







export const Page = async () => {
  

  const fs = require("fs");
  const path = require("path");

  const fullpath = path.join("src/app/legal/pp/", "policy.html");
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
