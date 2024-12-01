"use client"
import { useState, useContext, useEffect } from "react";
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import { AuthContext } from "../providers/AuthProvider";
import { HStack, Show, Spacer, Text, VStack } from "@chakra-ui/react";
import AccountCard from "../profile/components/accountCard";
import { isAuthenticated } from "../configs/api";
import { Delete, XCircle } from "@geist-ui/icons";



const AccountRecommendations = () => {

  const [recommended, setRecommended] = useState(false);
  const [end, setEnd] = useState(false);


  const { getAccountRecommendations } = useContext(AuthContext);

  useEffect(()=> {
    if(!isAuthenticated())
    {
      setEnd(true);
    }
    else{
      setEnd(false);
    }
  }, [])

  const fetchRecommendations = async () => {
    const response = await getAccountRecommendations();

    const data = await response.json();

    if(response.status===200)
    {
      setRecommended(data);
    }
    else{
      setEnd(true);
    }

  }

  useEffect(()=> {
    if(!end && !recommended)
    {
      fetchRecommendations();
    }
  }, [!recommended, !end])


  const handleHide = () => {
    localStorage.setItem("ARHidden", JSON.stringify(true));
  }

  const isHidden = () => {
    const x = localStorage.getItem("ARHidden");

    try{
      if(x!==null){
        if(JSON.parse(x))
        {
          return true;
        }
        return false;
      }

      return false;

    }catch(err){
      return false;
    }
  }


  if(recommended?.length && !isHidden())
  {
    return (
      <Show breakpoint="(min-width: 1000px)">
        <Card
          className="w-full h-1/2 max-h-[300px] bg-background border-1 shadow-none rounded-md my-4 left-5 relative"
        >
          <CardHeader
            className="w-full"
          >
            <HStack
              width={"100%"}
            >
              <Text
                fontSize={"medium"}
                color={"lightslategray"}
              >
                Account's you should follow
              </Text>

              <Spacer />

              <Button
                onClick={handleHide}
                variant="light"
                color="default"
                size="sm"
                endContent={<XCircle />}
              >
              </Button>
            </HStack>
          </CardHeader>

          <Divider />

          <CardBody
            className="h-full w-full"
          >
           <VStack
            width={"100%"}
            height={"100%"}
            overflowY={"scroll"}
            > 
              {
                recommended.map((rec)=> {
                  return <AccountCard inFeed account={rec} size={"sm"} />
                })
              }
           </VStack>
          </CardBody>
        </Card>
      </Show>
    )
  }
  else{
    return null;
  }

}



export default AccountRecommendations;
