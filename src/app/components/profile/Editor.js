'use client'
import { accountCacheGet, accountCacheStore, errorToReadable } from "@/app/utils/api";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { sendOtp, updateAccount } from "../helpers/Profile";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "react-responsive";
import { getImageClass } from "../helpers/sfwImageVerifier";




export const Editor = () => {

  const account = accountCacheGet();

  const [username, setUsername] = useState(account && account.username);
  const [fullName, setFullName] = useState(account && account.full_name);
  const [email, setEmail] = useState(account && account.email);
  const [avatar, setAvatar] = useState(account && account.avatar);
  const [bio, setBio] = useState(account && account.bio);
  const [siteLink, setSiteLink] = useState(account && account.site_link);
  const [loading, setLoading] = useState(false);
  const [bioFocused, setBioFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [siteLinkFocused, setSiteLinkFocused] = useState(false);
  const [avatarSafe, setAvatarSafe] = useState(true);


  const isDesktop = useMediaQuery({query: "(hover: hover) and (pointer: fine"});

  const { toast } = useToast();


  const handleSave = async () => {

    setLoading(true);

    const formData = new FormData();


    if(avatar && typeof avatar !== "string" && avatarSafe)
    {
      formData.append("avatar", avatar);
    }

    else if(avatar && !avatarSafe)
    {
      toast({
        title: "profile avatar was classified as nsfw!"
      });

      setLoading(false);
      return;
    }


    let data = {
    };


    if(account.username !== username)
      data['username'] = username;

    if(account.full_name != fullName)
      data['full_name'] = fullName;

    if(account.bio != bio)
      data['bio'] = bio;

    if(account.site_link != siteLink)
      data['site_link'] = siteLink;


    if(email != account.email)
    {
      data['email'] = email;

      const otp_res = await sendOtp();

      if(otp_res.ok)
      {
        toast({
          title: `Sent an otp link to "${account.email}".`,
          description: "Please click the otp link to save new email!"
        });

        setLoading(false);

        return;
      }

      else if(otp_res.status===401)
      {
        // do nothing
      }

      else{
        toast({
          title: `Error encountered while attempting to send otp link to "${account.email}"!`,
          description: errorToReadable(await otp_res.json())
        })

        setLoading(false);

        return;
      }


    }


    formData.append("data", JSON.stringify(data));

    const response = await updateAccount(formData);

    if(response.ok)
    {

      accountCacheStore(await response.json());

      toast({
        title: "Successfully updated your profile."
      });

    }

    else{
      toast({
        title: "Failed to update your profile!",
        description: errorToReadable(await response.json())
      })
    }

    setLoading(false);
  }


  const isDisabled = () => {

    if(!account || loading) return true;

    if(username!== account.username)
    {
      return false;
    }

    else if(fullName !== account.full_name)
    {
      return false;
    }


    else if(email !== account.email)
    {
      return false;
    }

    else if(bio !== account.bio)
    {
      return false;
    }

    else if(siteLink !== account.site_link)
    {
      return false;
    }


    else if(avatar !== account.avatar)
    {
      return false;
    }

    else{
      return true;
    }
  }



  useEffect(()=> {

    if(avatar && typeof avatar !== "string")
    {
      setLoading(true);

      const r = new FileReader();

      r.readAsDataURL(avatar);

      r.onload = async (e) => {

        const img_dat = e.target.result;
        const img_cls = await getImageClass(img_dat);

        if(img_cls==="sfw")
        {
          setAvatarSafe(true);
        }

        else
        {
          setAvatarSafe(false);
        }

        setLoading(false);
      }
    }


  }, [avatar])



  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="rounded-2xl">
          Edit profile
        </Button>
      </DrawerTrigger>


      <DrawerContent>

        <DrawerHeader>
          <DrawerTitle>
            Edit Profile
          </DrawerTitle>
        </DrawerHeader>

        <div className="h-[90svh] overflow-y-scroll p-10 flex flex-col gap-10">


          { ((bioFocused || emailFocused || siteLinkFocused) && !isDesktop) 
            ?
            null
            :
            <div className="flex flex-col gap-3 self-center">
              <Label>Avatar</Label>
              <div className="w-full flex flex-row justify-start min-w-[300px]">
                <Input type="file" className="w-full min-w-[250px] max-w-[400px] text-large" accept="image/png, image/gif, image/jpeg" onChange={(e)=>setAvatar(e.target.files[0])} />

              </div>
            </div>
          }




          { ((bioFocused || emailFocused || siteLinkFocused) && !isDesktop) 
            ?
            null
            :
          <div className="flex flex-col gap-3 self-center">
            <Label>Username</Label>
            <div className="w-full flex flex-row justify-start min-w-[300px]">
              <Input placeholder="username" className="w-full min-w-[250px] max-w-[400px] text-large" value={username} onChange={(e)=>setUsername(e.target.value)} />
            </div>
          </div>
          }


          { ((bioFocused || emailFocused || siteLinkFocused) && !isDesktop) 
            ?
            null
            :
          <div className="flex flex-col gap-3 self-center">
            <Label>Full Name</Label>
            <div className="w-full flex flex-row justify-start min-w-[300px]">
              <Input placeholder="Full Name" className="w-full min-w-[250px] max-w-[400px] text-large" value={fullName} onChange={(e)=>setFullName(e.target.value)} />
            </div>
          </div>
          }


          { ((bioFocused || siteLinkFocused) && !isDesktop) 
            ?
            null
            :
            <div className="flex flex-col gap-3 self-center">
              <Label>Email</Label>
              <div className="w-full flex flex-row justify-start min-w-[300px]">
                <Input onFocus={()=>setEmailFocused(true)} onBlur={()=>setEmailFocused(false)} placeholder="Email" className="w-full min-w-[250px] max-w-[400px] text-large" value={email} onChange={(e)=>setEmail(e.target.value)} />
              </div>
            </div>
          }



          { ((bioFocused || emailFocused) && !isDesktop) 
            ?
            null
            :
            <div className="flex flex-col gap-3 self-center">
              <Label>Site Link</Label>
              <div className="w-full flex flex-row justify-start min-w-[300px]">
                <Input onFocus={()=>setSiteLinkFocused(true)} onBlur={()=>setSiteLinkFocused(false)} placeholder="site link" className="w-full min-w-[250px] max-w-[400px] text-large" value={siteLink} onChange={(e)=>setSiteLink(e.target.value)} />
              </div>
            </div>
          }



          <div className="flex flex-col gap-3 self-center">
            <Label>Bio</Label>
            <div className="w-full flex flex-row justify-start min-w-[300px]">
              <Textarea onFocus={()=>setBioFocused(true)} onBlur={()=>setBioFocused(false)} placeholder="Bio" className="w-full min-w-[250px] max-w-[400px] text-large" value={bio} onChange={(e)=>setBio(e.target.value)} />
            </div>
          </div>


          <div className="w-full flex flex-row justify-center w-full">
            <Button 
              onClick={handleSave}
              disabled={isDisabled()}
            >
              save {loading && <Loader2 className="animate-spin" />}
            </Button>
          </div>

        </div>

      </DrawerContent>
    </Drawer>
  )


}




