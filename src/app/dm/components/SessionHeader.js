import { NavBack } from "@/app/globalComponents/buttonFunctions"
import { LeftSection } from "@/app/home/components/Sections"
import { AuthContext } from "@/app/providers/AuthProvider"
import { DirectMessageContext } from "@/app/providers/DirectMessageProvider"
import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider"
import { HStack, IconButton, Text, Spacer, useToast, VStack } from "@chakra-ui/react"
import { Archive, ArrowUp, PlusSquare, Search } from "@geist-ui/icons"
import { Popover } from "@mui/material"
import { Autocomplete, useDisclosure, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Input, Chip, Select, SelectItem, Textarea, Avatar } from "@nextui-org/react"
import { useState, useContext, useEffect } from "react";


export const SessionHeader = ({setMessages}) => {

  const createModal = useDisclosure();

  const { createSession, sendDM } = useContext(DirectMessageContext);
  const { getFriends, account } = useContext(AuthContext);
  const [friends, setFriends] = useState(false);
  const [loading, setLoading] = useState(false);
  const [friend, setFriend] = useState(null);
  const [message, setMessage] = useState(null);


  const fetchFriends = async () => {
    if(!account) return;

    setLoading(true);

    const response = await getFriends(account.username);

    const data = await response.json();

    if(response.status===200)
    {
      setFriends(data);
    }

    setLoading(false);
  }


  useEffect(()=> {
    if(!loading)
      fetchFriends();
  }, [createModal.isOpen])


  const toast = useToast();


  const handleNewSession = async () => {
    const response = await createSession(friend);

    const data = await response.json();

    if(response.status===200)
    {
      const res = await sendDM(data.id, message, null, null);

      const dat = await res.json();

      if(res.status===200)
      {
        createModal.onClose();
        setMessages(x=>x.filter((y)=>y.session.id!==dat.session.id));
        setMessages(p=>[...p, dat]);
        toast({
          title: "Successfully created a conversation!",
          status: "success",
          duration: 4000
        });
      }

      else{
        toast({
          title: "Error creating a conversation!",
          description: dat.error,
          status: "success",
          duration: 4000
        });
      }
    }

    else{
      toast({
        title: "Error creating a conversation!",
        description: data.error,
        status: "success",
        duration: 4000
      });
    }

  }


  return (
    <div className="w-full my-5 min-w-[400px] h-[5vh] border-0 rounded-lg place-self-center flex flex-row">

      <VStack className="h-full flex flex-col justify-center px-4">
        <HStack className="w-fit gap-0" spacing={0}>
          <NavBack />

          {/*
            <IconButton
              className="p-2"
              size={"xs"}
              as={Archive}
            />
          */}
        </HStack>
      </VStack>

      <Spacer />

      <Text className="text-xl font-semibold py-1">Conversations</Text>

      <Spacer />
      <Spacer />

      <VStack className="h-full flex flex-col justify-center px-4">
        <IconButton
          className="p-2"
          size={"xs"}
          as={PlusSquare}
          onClick={createModal.onOpen}
        />
      </VStack>


      <Modal isDismissable={false} isOpen={createModal.isOpen} onOpenChange={createModal.onOpenChange} size="lg">
        <ModalContent className="w-2/3 h-2/3 bg-background border-1">
          {(onClose)=> (
            <>
              <ModalHeader>
                Create a conversation
              </ModalHeader>
              
              <ModalBody className="w-full h-full flex flex-col">
                <HStack className="w-full justify-center">
                  <Select
                    classNames={{
                      base: "max-w-xs",
                      trigger: "min-h-12 py-2",
                    }}
                    isMultiline={true}
                    items={friends ? friends : []}
                    label="pick a friend"
                    labelPlacement="outside"
                    isRequired
                    placeholder="Select a friend"
                    onSelectionChange={(k)=>setFriend(k.anchorKey)}
                    renderValue={(items) => {
                      return (
                        <div className="flex flex-wrap gap-2 w-full">
                          {items.map((item) => (
                            <div className="flex flex-row gap-2 items-center w-full">
                              <Avatar alt={item.data.full_name} className="flex-shrink-0" size="sm" src={item.data.avatar} />
                              <span className="text-small text-primary-500 font-semibold">@{item.data.username}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                    selectionMode="multiple"
                    variant="bordered"
                  >
                    {(user) => (
                      <SelectItem key={user.username} textValue={user.username}>
                        <div className="flex gap-2 items-center">
                          <Avatar alt={user.full_name} className="flex-shrink-0" size="sm" src={user.avatar} />
                          <span className="text-small text-primary-500 font-semibold">@{user.username}</span>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                </HStack>


                <HStack className="w-full justify-end my-10">
                  <Textarea onChange={(t)=>setMessage(t.target.value)} placeholder="Message..." />
                  <VStack className="h-full flex flex-col justify-end">
                      <button
                        className="border-1 rounded-full p-1 hover:bg-default-50"
                        onClick={()=>handleNewSession()}
                      >
                        <ArrowUp size={25} />
                      </button>
                    </VStack>
                </HStack>

              </ModalBody>

              <ModalFooter>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  )
}
