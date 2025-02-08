import React, { useContext, useEffect, useState, useRef } from "react";
import { Badge, HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import { SessionScreenHeader } from "./SessionScreenHeader";
import { SessionEditor } from "./dmEditor";
import { DirectMessageContext } from "@/app/providers/DirectMessageProvider";
import { Spinner } from "@nextui-org/react";
import InfiniteScroll from "react-infinite-scroller";
import { DMMessage } from "../dmMessageCard";
import FlatList from "flatlist-react/lib";



export const DmScreen = ({messageStr}) => {

  const { viewSession } = useContext(DirectMessageContext);

  const [message, setMessage] = useState(false);

  const [messages, setMessages] = useState(
    [
        {
            "id": 4,
            "session": {
                "id": 1,
                "initiator": {
                    "email": "ceo@voidback.com",
                    "full_name": "Mohamed Tah",
                    "username": "mohamedtah",
                    "avatar": "https://media.voidback.com/media/avatars/62266202.png",
                    "bio": "",
                    "site_link": "",
                    "rank": 2,
                    "is_staff": true,
                    "isVerified": true,
                    "email_verified": true
                },
                "friend": {
                    "email": "braindaquizlet@gmail.com",
                    "full_name": "Bob Alice",
                    "username": "bob",
                    "avatar": null,
                    "bio": "",
                    "site_link": "",
                    "rank": 0,
                    "is_staff": false,
                    "isVerified": false,
                    "email_verified": false
                },
                "archived_by": [],
                "created_at": "2025-02-05T08:05:31.953679Z"
            },
            "sender": {
                "email": "braindaquizlet@gmail.com",
                "full_name": "Bob Alice",
                "username": "bob",
                "avatar": null,
                "bio": "",
                "site_link": "",
                "rank": 0,
                "is_staff": false,
                "isVerified": false,
                "email_verified": false
            },
            "post": null,
            "image": null,
            "message": "what do u want???",
            "sent_at": "2025-02-08T07:58:20.327321Z",
            "seen": true,
            "seen_at": "2025-02-08T07:58:24.738020Z"
        },
        {
            "id": 2,
            "session": {
                "id": 1,
                "initiator": {
                    "email": "ceo@voidback.com",
                    "full_name": "Mohamed Tah",
                    "username": "mohamedtah",
                    "avatar": "https://media.voidback.com/media/avatars/62266202.png",
                    "bio": "",
                    "site_link": "",
                    "rank": 2,
                    "is_staff": true,
                    "isVerified": true,
                    "email_verified": true
                },
                "friend": {
                    "email": "braindaquizlet@gmail.com",
                    "full_name": "Bob Alice",
                    "username": "bob",
                    "avatar": null,
                    "bio": "",
                    "site_link": "",
                    "rank": 0,
                    "is_staff": false,
                    "isVerified": false,
                    "email_verified": false
                },
                "archived_by": [],
                "created_at": "2025-02-05T08:05:31.953679Z"
            },
            "sender": {
                "email": "ceo@voidback.com",
                "full_name": "Mohamed Tah",
                "username": "mohamedtah",
                "avatar": "https://media.voidback.com/media/avatars/62266202.png",
                "bio": "",
                "site_link": "",
                "rank": 2,
                "is_staff": true,
                "isVerified": true,
                "email_verified": true
            },
            "post": null,
            "image": null,
            "message": "yo waddup b",
            "sent_at": "2025-02-08T07:56:59.694953Z",
            "seen": false,
            "seen_at": "2025-02-08T07:56:59.695003Z"
        },
        {
            "id": 1,
            "session": {
                "id": 1,
                "initiator": {
                    "email": "ceo@voidback.com",
                    "full_name": "Mohamed Tah",
                    "username": "mohamedtah",
                    "avatar": "https://media.voidback.com/media/avatars/62266202.png",
                    "bio": "",
                    "site_link": "",
                    "rank": 2,
                    "is_staff": true,
                    "isVerified": true,
                    "email_verified": true
                },
                "friend": {
                    "email": "braindaquizlet@gmail.com",
                    "full_name": "Bob Alice",
                    "username": "bob",
                    "avatar": null,
                    "bio": "",
                    "site_link": "",
                    "rank": 0,
                    "is_staff": false,
                    "isVerified": false,
                    "email_verified": false
                },
                "archived_by": [],
                "created_at": "2025-02-05T08:05:31.953679Z"
            },
            "sender": {
                "email": "ceo@voidback.com",
                "full_name": "Mohamed Tah",
                "username": "mohamedtah",
                "avatar": "https://media.voidback.com/media/avatars/62266202.png",
                "bio": "",
                "site_link": "",
                "rank": 2,
                "is_staff": true,
                "isVerified": true,
                "email_verified": true
            },
            "post": null,
            "image": null,
            "message": "yo bro",
            "sent_at": "2025-02-05T08:14:51.942132Z",
            "seen": false,
            "seen_at": "2025-02-05T08:14:51.942152Z"
        }
    ]
  ); // messages from this conversation e.g. DMSession

  const [page, setPage] = useState(1);
  const [end, setEnd] = useState(true);
  const [loading, setLoading] = useState(false);


  const getMessage = () => {
    setMessage(JSON.parse(messageStr));
  }


  useEffect(()=> {
    getMessage();
  }, [messageStr])


  const fetchMessages = async () => {

    if(end || !message) return;

    setLoading(true);

    const page = messages.length > 0 ? (messages.length/15)+1 : 1;

    const response = await viewSession(message.session.id, page);

    const data = await response.json();

    if(response.status==200)
    {
      if(messages.length)
        setMessages(prev=>[...prev, ...data.results]);
      else{
        setMessages(data.results);
      }

      if(!data.next)
        setEnd(true);

      else{
        setPage(p=>p+1);
      }
    }

    setLoading(false);
  }



  const renderDM = (dm) => {
     return <DMMessage message={dm} key={dm.id} />; 
  }


  if(!messageStr)
  {
    return (
      <VStack className="ml-10 w-full h-full p-2 place-self-center border-1 rounded-lg relative right-5 justify-center"
        >
        <Badge variant="outline" className="p-2" size={"lg"}>
            pick a conversation
        </Badge>
        </VStack>
    )
  }

  console.log(messages);

  return (
    <VStack
      gap={0}
      className="ml-10 w-full h-full place-self-center border-1 rounded-lg relative right-5 gap-0"
    >
      <SessionScreenHeader message={message} />
      <VStack
        className="w-full h-full"
        style={{overflowY: "scroll"}}
      >
        <FlatList
          pagination={{
            hasMore: !end, 
            loadMore: fetchMessages,
            loadingIndicator: <Spinner color="default" size="sm" />,
            loadingIndicatorPosition: "center"
          }}
          reversed
          list={messages}
          renderItem={renderDM}
          renderWhenEmpty={()=><Text>start the conversation...</Text>}
        />
      </VStack>

      <SessionEditor messageSession={message?.session?.id} setMessages={setMessages} />
    </VStack>
  )
}
