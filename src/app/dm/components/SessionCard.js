import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/providers/AuthProvider";
import { HStack, Text, VStack } from "@chakra-ui/react";
import { UserCard } from "@/app/profile/components/components";
import { Archive, Circle, Mic, Trash2 } from "@geist-ui/icons";
import { Avatar, Skeleton, Button, Divider, Card, Dropdown, DropdownMenu, DropdownTrigger, DropdownSection, DropdownItem, Tab } from "@nextui-org/react";
import { TextTrim } from "@/app/globalComponents/textTrim";
import { Touchable } from "@/app/auth/components";
import { BsThreeDots } from "@react-icons/all-files/bs/BsThreeDots";



export const SessionCard = ({message}) => {

  const { account, getAccountStatus } = useContext(AuthContext);


  const [lastActive, setLastActive] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getStatus = async () => {
    let username = message.session.initiator.username;

    if(message.session.initiator.username===account.username)
      username = message.session.friend.username
    else
      username = message.session.initiator.username

    const response = await getAccountStatus(username);

    const data = await response.json();

    if(response.status===200)
    {
      setLastActive(data.last_active);

      const diff = new Date().getTime() - new Date(data.last_active).getTime();


      var diffDays = Math.floor(diff / 86400000); // days
      var diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
      var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes

      if(diffDays > 0)
      {
        setIsActive(false);
      }

      else if(diffHrs > 0)
      {
        setIsActive(false);
      }

      else if(diffMins > 1)
      {
        setIsActive(false);
      }

      else{
        setIsActive(true);
      }
    }

  }


  useEffect(()=> {
    if(account)
      getStatus();
  }, [account])





  const hdate = require("human-date");


  const messageIcon = () => {
    if(message.image) {

      return <Image size={20}  />
    }


    else if(message.post) {
      return <Forward size={20}  />
    }

  }


  if(!account)
  {
    return (
      <Skeleton isLoaded={account} className="w-full h-[30vh]">
      </Skeleton>
    )
  }


  return (
    <VStack
      className="w-full h-[10vh] p-0 my-10"
    >
      <HStack className="w-full flex flex-row justify-between">
      {
        account.username===message.session.initiator.username
        ?
          <UserCard 
              username={message.session.friend.username} 
              fullName={message.session.friend.full_name}
              isActive={isActive} 
              hideUsername 
              avatar_size={"lg"}
              isRound 
              textUnderName={
                <HStack className="w-fit h-fit p-1 gap-2">
                    <Text
                      className="text-sm font-[600] text-default-900"
                    >
                      { message.message
                        ?
                        message.sender.username==account.username && !message.seen ? `you: ${TextTrim(message.message, 20)}` : message.sender.username==account.username && message.seen ? "seen" : `${TextTrim(message.message, 20)}`
                        :
                        messageIcon(message)
                    }
                    </Text>

                </HStack>
              }  
          />
        :
          <UserCard 
              username={message.session.initiator.username} 
              fullName={message.session.initiator.full_name}
              isActive={isActive} 
              hideUsername 
              isRound 
              avatar_size={"lg"}
              textUnderName={
                <HStack className="w-fit h-fit p-1 gap-2">
                  <Text
                    className="text-sm font-[600] text-default-900"
                  >
                    { message.message
                      ?
                      message.sender.username==account.username && !message.seen ? `you: ${TextTrim(message.message, 20)}` : message.sender.username==account.username && message.seen ? "seen" : `${TextTrim(message.message, 20)}`
                      :
                      messageIcon(message)
                  }
                  </Text>

                </HStack>
              } 
            />
      }


        <VStack
          className="w-fit flex flex-col h-full justify-between p-4"
        >

        {
          !message.seen && message.sender.username!=account.username
            ?
              <>
            <Text
              className="text-sm font-[500] text-default-500"
            >
              { 
                message.sender.username===account.username && message.seen
                ?
                  hdate.relativeTime(message.seen_at)
                :
                 hdate.relativeTime(message.sent_at)
              }
            </Text>

            <HStack className="w-fit justify-center">
              <Circle size={15} fill={"white"} color={"black"} />
            </HStack>
            </>

          :
            <Text
              className="text-sm font-[700] text-default-600"
            >
              { 
                message.sender.username==account.username && message.seen
                ?
                  hdate.relativeTime(message.seen_at)
                :
                 hdate.relativeTime(message.sent_at)
              }
            </Text>
        }


          </VStack>


      <Dropdown
        size="sm"
        showArrow
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content:
            "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
        }}
      >
        <DropdownTrigger>
          <Button size="sm" variant="light"><BsThreeDots size={20} /></Button>
        </DropdownTrigger>

        <DropdownMenu aria-label="dm-menu" variant="faded">
          <DropdownSection title="Actions">
            <DropdownItem
              key="new"
              description="Delete DM Session"
              endContent={<Trash2 color="tomato" />}
            >
                Delete
            </DropdownItem>

            <DropdownItem
              key="copy"
              description="Archive DM Session"
              endContent={<Archive />}
            >
                Archive
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

    </HStack>

    </VStack>
  )
}
