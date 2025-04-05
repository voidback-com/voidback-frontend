import { useContext, useEffect, useState } from "react";
import { HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import { UserCard } from "./components";
import { MdLink } from "react-icons/md";
import { Button, Link, Skeleton } from "@nextui-org/react";
import { AuthContext } from "@/app/providers/AuthProvider";





// includes the follow/unfollow feature and truncated bio
const AccountCard = ({account, size, verified_size, inFeed, avatarSize}) => {

  const auth = useContext(AuthContext);

  const [followStatus, setFollowStatus] = useState(false);

  const getFollowStatus = async () => {
    const response = await auth.isFollowed(account.username);

    if(response)
    {
      setFollowStatus(2);
    }
    else{
      setFollowStatus(1);
    }

  }

  useEffect(()=> {
    if(auth.account)
    {
      if(account.username===auth.account.username)
        setFollowStatus(3)
      else
        getFollowStatus();
    }
  }, [!followStatus, auth.account])


  return (
    <VStack
      width="100%"
      height={"fit-content"}
      className="p-2"
    >
      <HStack
        width={"100%"}
      >
        <UserCard
          username={account.username}
          avatarUrl={account.avatar}
          fullName={account.full_name}
          avatar_size={avatarSize ? avatarSize : "sm"}
          name_size={size ? size : "sm"}
          username_size={size ? size : "sm"}
          isVerified={account.isVerified}
          verified_size={verified_size}
        />

        {
          inFeed
          ?
          <Spacer/>
          :
            null
        }

        <Skeleton
          isLoaded={followStatus}
        >
          { followStatus===1
            ?
            <Button
              variant="solid"
              size={"sm"}
              onClick={()=>{
                auth.follow(account.username);
                setFollowStatus(2);
              }}
            >
              follow
            </Button>
            :
            followStatus===2
            ?
            <Button
              variant="bordered"
              size={"sm"}
              onClick={()=>{
                auth.unfollow(account.username);
                setFollowStatus(1);
              }}
            >
              following
            </Button>
            :
            null
          }
        </Skeleton>

      </HStack>

      <HStack
        width="100%"
        paddingLeft={5}
      >
        <Skeleton isLoaded={!account ? false : true}>
          <Text
            fontFamily={"sans-serif"}
            fontSize={14}
            maxWidth={300}
            className="text-clip"
          >
            {account && account.bio}
          </Text>
        </Skeleton>

        <Skeleton isLoaded={!account ? false : true}>
            { account && account.site_link &&

            <HStack
            >
              <MdLink size={20} color={"lightslategrey"} />
              <Link isExternal href={account.site_link}>
                {account.site_link}
              </Link>
            </HStack>
            }
        </Skeleton>

      </HStack>


    </VStack>
  )

}


export default AccountCard;
