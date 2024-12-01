'use client'
import { 
  useState,
  useContext,
} from "react";
import { 
  VStack,
  Text,
  Skeleton,
  Spacer,
  HStack,
  Divider,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "@react-icons/all-files/fa/FaChevronDown";
import { PostBottomBar, PostTopBar } from "@/app/view/post/components/postbars";
import { Touchable } from "@/app/auth/components";
import { AiOutlineSortDescending } from "@react-icons/all-files/ai/AiOutlineSortDescending";
import { AiOutlineSortAscending } from "@react-icons/all-files/ai/AiOutlineSortAscending";
import {
  Dropdown, 
  DropdownItem, 
  DropdownMenu, 
  DropdownSection, 
  DropdownTrigger,
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Button,
  User,
  Modal,
  ModalContent,
  ModalBody
} from "@nextui-org/react";
import { SidebarContext } from "@/app/providers/FeedsProvider/SidebarProvider";
import Link from "next/link";
import { errorToReadable } from "@/app/configs/api";
import { Send } from '@geist-ui/icons';
import { ReadonlyEditor, Editor } from "@/app/editor/components/editor";
import { MediaSection } from "@/app/view/post/components/MediaSection";
import { UserCard } from "@/app/profile/components/components";



// many destinations
export const InboxEditorMany = ({from, post_id}) => {

  const [content, setContent] = useState(null);
  const [text, setText] = useState("");
  const [attributes, setAttributes] = useState(null);

  const [loading, setLoading] = useState(false);


  const { sendToInbox } = useContext(SidebarContext);


  const toast = useToast();


  const submit = () => {
    setLoading(true);

    if(!attributes.mentions.length)
    {
      toast({
        title: "No mentions to forward to!",
        status: "warning",
        duration: 3000
      })
    }

    attributes.mentions.forEach(async (m)=> {
      let to = m.username;


      const response = await sendToInbox(post_id, to, content);

      const data = await response.json();

      if(response.status!==200)
      {
        toast({
          title: `Error forwarding to "@${to}"`,
          description: errorToReadable(data),
          status: "error",
          duration: 4000
        })
      }
      else{
        toast({
          title: `Forwarded to "@${to}"`,
          status: "success",
          duration: 3000
        })
      }

    })
    setLoading(false);
  }


  return (
      <Skeleton isLoaded={!loading} className="w-full h-full">
        <VStack className="w-full max-w-full overflow-hidden">
          <Editor setContent={setContent} setText={setText} setAttributes={setAttributes} />


          <Button
            variant="bordered"
            size="sm"
            endContent={<Send size={20} />}
            onPress={submit}
          >
          </Button>
        </VStack>
      </Skeleton>
  )
}



export const InboxEditor = ({from, post_id, to}) => {

  const [content, setContent] = useState(null);
  const [text, setText] = useState("");
  const [attributes, setAttributes] = useState(null);

  const [loading, setLoading] = useState(false);


  const { sendToInbox } = useContext(SidebarContext);


  const toast = useToast();


  const submit = async () => {
    setLoading(true);

    const response = await sendToInbox(post_id, to, content);

    const data = await response.json();


    if(response.status!==200)
    {
      toast({
        title: `Error forwarding to "@${to}"`,
        description: errorToReadable(data),
        status: "error",
        duration: 4000
      })
    }
    else{
      toast({
        title: `Forwarded to "@${to}"`,
        status: "success",
        duration: 3000
      })
    }

    setLoading(false);
  }


  return (
      <Skeleton isLoaded={!loading} className="w-full h-full">
        <VStack className="w-full max-w-full overflow-hidden">
          <Editor setContent={setContent} setText={setText} setAttributes={setAttributes} />


          <Button
            variant="bordered"
            size="sm"
            endContent={<Send size={20}/>}
            onPress={submit}
          >
          </Button>
        </VStack>
      </Skeleton>
  )
}


// inbox card should have (reply and delete) options

export const PostCard = ({id, post, from, caption, account, created_at}) => {

  const { deleteFromInbox } = useContext(SidebarContext);


  const router = useRouter();

  const replyModal = useDisclosure();
  const deleteModal = useDisclosure();

  const toast = useToast();



  const handleDelete = async () => {

    const response = await deleteFromInbox(id);

    const data = await response.json();


    if(response.status!==200)
    {
      toast({
        title: "Failed to delete post from inbox",
        description: errorToReadable(data),
        status: "error",
        duration: 3000,
        isClosable: true
      })
    }

    else{
      toast({
        title: "Successfully deleted post from inbox",
        status: "success",
        duration: 3000,
        isClosable: true
      })

      deleteModal.onClose();
    }
  }

  const hdate = require("human-date");



  const renderNullPost = () => {
    return (
      <VStack
        bg={"default"}
        className="bg-background"
        spacing={0}
        overflow="hidden"
        marginTop={10}
        width={"50vw"}
        style={{scrollbarWidth: "none"}}
        padding={4}
      >
        <Card
          className="p-4 w-full shadow-none border-0 bg-transparent"
        >
          <VStack style={{scrollbarWidth: "none"}}>
            <HStack
              width="100%"
            >
              <Skeleton isLoaded={from}>
                  <User 
                  name={from && from.full_name}
                  description={(
                    <Link href={`/view/account/${from && from.username}`}>
                      @{from.username}
                    </Link>
                  )}
                  avatarProps={{src: from.avatar}}
                />

              </Skeleton>


              <Spacer/>

              <Text
                color="lightslategrey"
                fontSize={"small"}
                textTransform={"lowercase"}
              >
                {hdate.relativeTime(created_at)}
              </Text>

              <Divider height={"25px"} orientation="vertical" />

              <Button
                size="sm"
                onClick={replyModal.onOpen}
              >
                reply
              </Button>


              <Button
                size="sm"
                onClick={deleteModal.onOpen}
              >
                delete
              </Button>

            </HStack>


            {
             caption 
              ?
                <ReadonlyEditor content={caption} />
              :
              null
            }


            {/* Delete From Inbox Modal */}
            <Modal
              isOpen={deleteModal.isOpen}
              onClose={deleteModal.onClose}
            >
              <ModalOverlay />

              <ModalContent
                backgroundColor="Background"
                width="100%"
              >

                {(onClose) => (

                  <ModalBody
                    padding={8}
                    height={"100%"}
                  >
                    <VStack
                      height="100%"
                    >
                      <VStack
                      >
                        <Text
                          fontWeight={"semibold"}
                        >
                          Are you sure?
                        </Text>
                      <Spacer/>
                        <Text
                          color={"lightslategrey"}
                          fontFamily={"sans-serif"}
                          fontSize={"small"}
                        >
                          This action is irreversible, once you delete this post from your inbox you can't get it back.
                        </Text>
                      </VStack>

                      <Spacer/>
                      <Spacer/>

                      <HStack
                        width="60%"
                      >
                        <Button color={"tomato"}
                          onClick={handleDelete}
                          size={"sm"}
                        >
                          Delete
                        </Button>

                        <Spacer/>

                        <Button
                          onClick={deleteModal.onClose}
                          size={"sm"}
                        >
                          Cancel
                        </Button>
                      </HStack>

                    </VStack>
                  </ModalBody>
                )}


              </ModalContent>
            </Modal>


            {/* Reply to forwarded post */}

            <Modal
              isOpen={replyModal.isOpen}
              onClose={replyModal.onClose}
            >
              <ModalOverlay />

              <ModalContent
                backgroundColor="Background"
                width="100%"
              >
                <ModalCloseButton />

                <ModalBody
                  padding={10}
                  height={"100%"}
                >
                  <VStack
                    height="100%"
                  >
                    <InboxEditor
                      from={account.username}
                      post_id={post && post.id}
                      to={from.username}
                    />
                  </VStack>
                </ModalBody>

              </ModalContent>
            </Modal>



            <VStack 
              width="90%"
            >
              <Card
                className="shadow-none border-1"
              >
                <CardBody>
                  <Text>This post was deleted!</Text>
                </CardBody>
              </Card>
            </VStack>
          </VStack>
        </Card>
        <Divider />
   </VStack>


    )
  }


  const renderPost = () => {

    return (
      
      <VStack
        bg={"default"}
        className="bg-background"
        spacing={0}
        overflow="hidden"
        marginTop={10}
        width={"50vw"}
        style={{scrollbarWidth: "none"}}
        padding={4}
      >
        <Skeleton 
          isLoaded={post}
          width="100%"
        >
          <Card
            className="p-4 w-full shadow-none border-0 bg-transparent"
          >
            <VStack>
              <HStack
                width="100%"
              >
                <Skeleton isLoaded={from}>
                  <UserCard
                    fullName={from.full_name}
                    avatarUrl={from.avatar}
                    username={from.username}
                    username_size={"sm"}
                    name_size={"sm"}
                    avatar_size={"sm"}
                  />
                </Skeleton>


                <Spacer/>

                <Text
                  color="lightslategrey"
                  fontSize={"small"}
                  textTransform={"lowercase"}
                >
                  {post && hdate.relativeTime(created_at)}
                </Text>

                <Divider height={"25px"} orientation="vertical" />

                <Button
                  size="sm"
                  onClick={replyModal.onOpen}
                >
                  reply
                </Button>


                <Button
                  size="sm"
                  onClick={deleteModal.onOpen}
                >
                  delete
                </Button>

              </HStack>


              <VStack width={"100%"} height={"fit-content"} marginTop={5}>
              {
               caption 
                ?
                  <ReadonlyEditor content={caption} />
                :
                null
              }
              </VStack>


              {/* Delete From Inbox Modal */}
              <Modal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                className="bg-background border-1"
                placement="center"
              >

                <ModalContent
                  backgroundColor="Background"
                  width="100%"
                >
                  {(onClose) => (

                    <ModalBody
                      padding={8}
                      height={"100%"}
                    >
                      <VStack
                        height="100%"
                      >
                        <VStack
                        >
                          <Text
                            fontWeight={"semibold"}
                          >
                            Are you sure?
                          </Text>
                        <Spacer/>
                          <Text
                            color={"lightslategrey"}
                            fontFamily={"sans-serif"}
                            fontSize={"small"}
                          >
                            This action is irreversible, once you delete this post from your inbox you can't get it back.
                          </Text>
                        </VStack>

                        <Spacer/>
                        <Spacer/>

                        <HStack
                          width="60%"
                        >
                          <Button 
                            color="danger"
                            onClick={handleDelete}
                            size={"sm"}
                          >
                            Delete
                          </Button>

                          <Spacer/>

                          <Button
                            onClick={deleteModal.onClose}
                            size={"sm"}
                          >
                            Cancel
                          </Button>
                        </HStack>

                      </VStack>
                    </ModalBody>
                  )}
                </ModalContent>
              </Modal>


              {/* Reply to forwarded post */}

              <Modal
                isOpen={replyModal.isOpen}
                onClose={replyModal.onClose}
                className="bg-background border-1"
                placement="center"
              >

                <ModalContent
                  width="100%"
                >

                  {(onClose)=> (
                    <ModalBody
                      padding={10}
                      height={"100%"}
                    >
                      <VStack
                        height="100%"
                      >
                        <InboxEditor
                          from={account.username}
                          post_id={post && post.id}
                          to={from.username}
                        />
                      </VStack>
                    </ModalBody>
                  )}
                </ModalContent>
              </Modal>



              <VStack 
                width="90%"
                padding={5}
              >
                <Card
                  className="shadow-none border-1 bg-background w-full"
                  isPressable
                  onPress={()=>router.push(`/view/post/${post.id}`)}
                >
                  <CardHeader>
                  {
                    post
                    ?
                    <PostTopBar post={post} />
                    : null
                  }
                  </CardHeader>

                  <CardBody>
                  {
                    post && post.image || post.video
                    ?
                        <MediaSection video={post.video} image={post.media} />
                    :
                    null
                  }


                  {
                    post
                      &&
                      <Touchable onClick={()=>router.push(`/view/post/${post.id}`)}>
                      <ReadonlyEditor content={post.content} />
                    </Touchable>
                  }

                  </CardBody>

                  <CardFooter>
                    {post ?
                      <PostBottomBar post={post} isInFeed={false} />
                      : null
                    }
                  </CardFooter>

                </Card>
              </VStack>
            </VStack>
          </Card>
          
        </Skeleton>
        <Divider />
     </VStack>

    )
  }

  return post===null ? renderNullPost() : renderPost()

}



export const InboxFilter = ({inbox, order, setOrder, from, setFrom}) => {

  // implement inbox filters: such as oderby, only this author etc...


  const uniqueFroms = () => {
    let froms = [];

    inbox.forEach(({from_account})=> {
      let unique = true;
      froms.filter((f)=>{
        if(f.username===from_account.username)
          unique=false
      })

      if(unique)
      {
        froms.push(from_account);
      }
    })

    return froms;
  }


  return (
    <HStack>
      <Dropdown closeOnSelect={false} type="menu">
        <DropdownTrigger>
          <Button
            size={"sm"}
            endContent={<FaChevronDown size={12} />}
          >
            filters
          </Button>
        </DropdownTrigger>

        <DropdownMenu 
          selectionMode="multiple"
          selectedKeys={[from, order]}
        >
          <DropdownSection
            showDivider
            title="From" 
            key={"from"}
            items={from}
          >

            <DropdownItem
              key="all"
              onAction={(k)=>setFrom(k)}
              textValue="all"
            >
              All
            </DropdownItem>

            {
              uniqueFroms().map((f)=> {
                return (
                  <DropdownItem
                    key={f.username}
                    onAction={(k)=>setFrom(k)}
                    textValue={f.username}
                  >
                    @{f.username}
                  </DropdownItem>
                )
              })
            }

          </DropdownSection>


          <DropdownSection 
            title="Order" 
            items={order}
            key={"order"}
          >
            <DropdownItem
            endContent={<AiOutlineSortAscending size={24} />}
            key={"asc"}
            onAction={(k)=>setOrder(k)}
            textValue="asc"
            >
              Ascending
            </DropdownItem>

            <DropdownItem
            endContent={<AiOutlineSortDescending size={24} />}
            key={"desc"}
            onAction={(k)=>setOrder(k)}
            textValue="desc"
            >
              Descending 
            </DropdownItem>


        </DropdownSection>
        </DropdownMenu>
      </Dropdown>

    </HStack>
  )

}



