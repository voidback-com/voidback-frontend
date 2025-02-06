import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/app/providers/AuthProvider"
import { Circle, HStack, IconButton, Spacer, Text, VStack } from "@chakra-ui/react"
import { Archive, PlusSquare, Search, Settings, Trash2 } from "@geist-ui/icons"
import { Button, Autocomplete, AutocompleteItem, Input, DropdownMenu, DropdownTrigger, Dropdown, Spinner, DropdownItem, DropdownSection } from "@nextui-org/react"
import { RiChatNewFill } from "@react-icons/all-files/ri/RiChatNewFill"
import { UserCard } from "@/app/profile/components/components";
import { BsThreeDots } from "@react-icons/all-files/bs/BsThreeDots";


export const SessionScreenHeader = ({message}) => {

  const { account, getAccountStatus } = useContext(AuthContext);

  const [lastActive, setLastActive] = useState(false);
  const [isActive, setIsActive] = useState(false);


  const getStatus = async () => {

    if(!message) return;

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
    getStatus();
  }, [isActive, !lastActive])


  if(!account || !message)
    return <Spinner />


  const hdate = require("human-date");

  console.log(lastActive);

  return (
    <div className="w-full my-5 min-w-[400px] h-fit p-2 border-0 rounded-lg place-self-center flex flex-row">
      <HStack className="flex flex-row justify-between w-full h-fit">
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
                  <Text
                    className="text-sm font-[600] text-default-900"
                  >
                  {lastActive ? `last active ${hdate.relativeTime(lastActive)}` : ""}
                  </Text>

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
                  <Text
                    className="text-sm font-[600] text-default-900"
                  >
                  {lastActive ? `last active ${hdate.relativeTime(lastActive)}` : "offline"}
                  </Text>

              } 
            />
      }
    </HStack>
    </div>
  )
}
