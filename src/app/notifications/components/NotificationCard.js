'use client'
import { HStack, Text, VStack, Spacer, useToast } from "@chakra-ui/react";
import { Avatar, Card, Button, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { MessageCircle, Mail, Bell, Trash2, AtSign } from '@geist-ui/icons';
import { IoHeartDislikeSharp } from "@react-icons/all-files/io5/IoHeartDislikeSharp";
import { FaHeart } from "@react-icons/all-files/fa/FaHeart";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";



const icons = {
  "notification": <Bell size={20} color="default" />,
  "message": <MessageCircle size={20} color="default" />,
  "like": <FaHeart size={20} color="tomato" />,
}




const NotificationCard = ({data, handleRemove}) => {


  const { deleteNotification } = useContext(LeftFeedContext);

  const mediaUrl = "https://media.voidback.com/media/"

  const hdate = require("human-date");

  const toast = useToast();


  const handleDelete = async () => {
    const response = await deleteNotification(data.id);

    if(response.status===200)
    {
      handleRemove(data.id);
      toast({
        title: "Successfully deleted the notification.",
        duration: 3000,
        status: "success"
      })
    }
  }


  const router = useRouter();


  return (
    <Card
      className="bg-background rounded-md border-0 w-[400px] my-2 shadow-none h-fit"
    >

      <CardHeader
      >
        <HStack
          width={"100%"}
          height={"fit-content"}
        >
          <Avatar 
            src={data.fromAvatar ? mediaUrl+data.fromAvatar : "/logo.png"}
            name={data.fromName[0]}
            showFallback
            size="sm"
            className="rounded-md"
          />


          <Card 
            isPressable={data.navPath!==null} 
            className="bg-background w-full shadow-none rounded-none"
            onPress={()=>router.push(data.navPath)}
          >
            <HStack
              height={"fit-content"}
              width={"100%"}
            >

              <Text 
                fontSize={"small"}
              >
                {data.fromNameMessage}
              </Text>
              <Text
               fontSize={"small"} 
                fontWeight={600}
              >
                {data.fromName}
              </Text>

              <Spacer />

              {icons[data.icon]}
            </HStack>
          </Card>

        </HStack>

      </CardHeader>
      <CardBody
        className="w-full flex flex-col"
      >
        
        <Card 
          onPress={()=>router.push(data.navPath)}
          isPressable={data.navPath!==null} 
          className="bg-background w-full shadow-none rounded-none"
        >
          <Text
            fontSize={"small"}
            className="mx-2"
            >
              {data.body}
          </Text>
        </Card>

      </CardBody>

      <CardFooter className="w-full p-0">
        <HStack
          width="100%"
        >
          <Text
            color={"slategrey"}
            fontSize={"small"}
            fontFamily={"sans-serif"}
          >
            {hdate.relativeTime(data.created_at)}
          </Text>

          <Spacer />

          <Button
            onClick={handleDelete}
            variant="ghost"
            isIconOnly
            className="border-0"
          >
            <Trash2 size={20} color="default" />
          </Button>
        </HStack>
      </CardFooter>
    </Card>
  )
}


export default NotificationCard;
