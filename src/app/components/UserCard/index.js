'use client'
import { accountCacheGet, accountCacheStore, API_URL, isAuthenticated, toAuthHeaders } from "@/app/utils/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { BadgeCheck, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"



export const UserAvatar = ({avatarURL, fullName}) => {
  return (
    <Avatar>
      <AvatarImage src={avatarURL} />
      <AvatarFallback>{fullName[0]}</AvatarFallback>
    </Avatar>
  )
}



export const AuthUserCard = () => {

  const router = useRouter();

  const account = accountCacheGet();

  if(!account)
    return <UserAvatar fullName={[<User />]} />;

  return (
    <div
      itemScope
      itemType="Person"
      className="border-[0px] w-fit flex flex-row shadow-none rounded-none gap-2"
      onClick={()=>router.push(`/profile`)}
    >
      <div itemScope itemType="Image" className="h-full flex flex-col justify-center">
        <UserAvatar avatarURL={account.avatar} fullName={account.full_name} />
      </div>


      <div className="h-full flex flex-col justify-center">
        <div className="w-fit flex flex-row gap-2 justify-between">

          <div className="h-full flex flex-col justify-center">
            <p itemScope itemType="name" className="font-semibold text-md">{account.full_name}</p>
          </div>

          {!account.verified && <BadgeCheck className="text-background fill-foreground" />}

          
        </div>

        <div className="h-full flex flex-col justify-center">

            <p className="text-sm text-muted-foreground">@{account.username}</p>
        </div>

      </div>

    </div>
  )
}


export const UserCard = ({username, fullName, avatarUrl, verified, returnAuthenticatedUser}) => {


  const [isFollowed, setisFollowed] = useState(null);
  const [account, setAccount] = useState(null);
  const [returnAuthenticated, setReturnAuthenticated] = useState(returnAuthenticatedUser);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);


  const getAccount = async () => {

    const acc = accountCacheGet();

    if(acc)
    {
      setAccount(acc);
      return acc;
    }

    const response = await fetch(API_URL+`account`, {
      method: "GET",
      headers: toAuthHeaders({})
    });


    const data = await response.json();

    if(response.ok)
    {
      accountCacheStore(data);
      setAccount(data);
      return data;
    }

  }


  const getFollowStatus = async () => {

    if(loading || loaded) return;

    setLoading(true);

    const acc = await getAccount();


    if(acc.username===username)
    {
      setReturnAuthenticated(true);
      setLoading(false);
      setLoaded(true);
      return;
    }


    const response = await fetch(API_URL+`account/isFollowed?username=${username}`, {
      method: "GET",
      headers: toAuthHeaders({})
    });


    if(response.ok)
    {
      setisFollowed(true);
    }
    else{
      setisFollowed(false);
    }

    setLoading(false);
    setLoaded(true);
  }

  const { toast } = useToast();


  const handleFollow = async () => {
    if(loading) return;

    setLoading(true);
    setisFollowed(true);

    const response = await fetch(API_URL+`account/follow?username=${username}`, {
      method: "GET",
      headers: toAuthHeaders({})
    });

    if(response.ok)
    {
      setisFollowed(true);
    } else{
      toast({
        title: `Failed to follow "${username}".`,
        description: "please try again, maybe refresh browser!"
      });
      setisFollowed(false);
    }

    setLoading(false);
  }


  const handleUnfollow = async () => {
    if(loading) return;

    setLoading(true);
    setisFollowed(false);

    const response = await fetch(API_URL+`account/unfollow?username=${username}`, {
      method: "GET",
      headers: toAuthHeaders({})
    });

    if(response.ok)
    {
      setisFollowed(false);
    } else{
      toast({
        title: `Failed unfollowing "${username}".`,
        description: "please try again, maybe refresh browser!"
      });
    }

    setLoading(false);
  }


  useEffect(()=> {
    if(isFollowed===null && isAuthenticated() && account===null && !returnAuthenticatedUser && !loading && !loaded)
    {

      getFollowStatus();

      // finish this first (make sure you fetch account and check if the user is the same if not then check the follow status)
      // and then move to implementing/fixing image write up list issue
    }
  }, [!loaded])


  if(returnAuthenticated && account && !loading)
  {
    return <AuthUserCard />
  }



  const router = useRouter();

  return (
    <div
      itemScope
      itemType="Person"
      className="border-[0px] w-fit flex flex-row shadow-none rounded-none gap-2"
      onClick={()=>router.push(`/view/account/${username}`)}
    >
      <div itemScope itemType="Image" className="h-full flex flex-col justify-center">
        <UserAvatar avatarURL={avatarUrl} fullName={fullName} />
      </div>


      <div className="h-full flex flex-col justify-center">
        <div className="w-fit flex flex-row gap-2 justify-between">

          <div className="h-full flex flex-col justify-center">
            <p itemScope itemType="name" className="font-semibold text-md">{fullName}</p>
          </div>

          {!verified && <BadgeCheck className="text-background fill-foreground" />}


          {isFollowed===true ? (

            <Button onClick={()=>handleUnfollow()} className="p-1 relative top-1 h-fit">unfollow</Button>

          ) : isFollowed===false ? (

            <Button onClick={()=>handleFollow()} className="p-1 relative top-1 h-fit">follow</Button>

          ) : null}
          
        </div>

        <div className="h-full flex flex-col justify-center">

            <p className="text-sm text-muted-foreground">@{username}</p>
        </div>

      </div>

    </div>
  )
}
