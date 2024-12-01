import { 
  VStack,
  Container,
  Text
} from "@chakra-ui/react";




const Page = () => {

  return (
    <Container minW={"100%"} overflow={"hidden"} height="100vh" className="bg-background flex flex-col justify-around">
      <Text alignSelf={"center"} paddingBottom={"50vh"}>Be patient, it's coming on the 1st of january 2025.</Text>
    </Container>
  )
}



export default Page;
