'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { NavigationBar } from "../components/Navigation";
import { Accordion, AccordionTrigger } from "@/components/ui/accordion";
import { AccordionContent, AccordionItem } from "@radix-ui/react-accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, SeparatorVertical } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { accountCacheDelete, accountCacheGet, errorToReadable, isAuthenticated } from "../utils/api";
import { deleteAccount, resetPassword, sendOtp } from "../components/helpers/Profile";
import NotFound from "../not-found";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";


const Page = () => {

  const [password, setPassword] = useState("");

  const { toast } = useToast();

  const account = accountCacheGet();

  const router = useRouter();

  const [loading, setLoading] = useState(false);


  const isDisabled = () => {
    if(isAuthenticated())
      return false;

    return true;
  }


  const handlePassword = async () => {

    setLoading(true);

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
      const res = await resetPassword(account.email, password);
      
      if(res.ok)
      {
        toast({
          title: "Successfully changed your password."
        });
      }

      else{
        toast({
          title: "Failed to change password!",
          description: errorToReadable(await res.json())
        });
      }
    }

    else{
      toast({
        title: `Error encountered while attempting to send otp link to "${account.email}"!`,
        description: errorToReadable(await otp_res.json())
      })

      setLoading(false);

      return;
    }


    setLoading(false);
  }


  const handleDeleteAccount = async () => {
    setLoading(true);

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
      const res = await deleteAccount();
      
      if(res.ok)
      {
        toast({
          title: "Successfully deleted your account."
        });

        deleteCookie("authTok");
        accountCacheDelete();
        router.refresh();
      }

      else{
        toast({
          title: "Failed to delete your account!",
          description: errorToReadable(await res.json())
        });
      }
    }

    else{

      toast({
        title: `Error encountered while attempting to send otp link to "${account.email}"!`,
        description: errorToReadable(await otp_res.json())
      })

      setLoading(false);

      return;
    }


    setLoading(false);
  }


  const handleLogout = () => {
    deleteCookie("authTok");
    accountCacheDelete();

    toast({
      title: `Logged out!`,
    });


    router.refresh();
  }

  return (
    <div className="w-[100svw] h-[100svh] bg-background">

      <NavigationBar selected="settings" feed={
        <div className="h-full w-full p-10 flex flex-col">
          <Accordion>

            <AccordionItem disabled={isDisabled()} value="change-password">
              <AccordionTrigger className={`${isDisabled() && "text-muted-foreground"}`}>
                Change Password
              </AccordionTrigger>

              <AccordionContent className="flex flex-row justify-center gap-5">
                <Input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="new password" className="w-1/2 place-self-center" />
                <Button disabled={!password || loading} onClick={handlePassword} className="w-fit place-self-end">
                  change {loading && <Loader2 className="animate-spin" />}
                </Button>
              </AccordionContent>
            </AccordionItem>


            <AccordionItem disabled={isDisabled()} value="delete-account">
              <AccordionTrigger className={`${isDisabled() && "text-muted-foreground"}`}>
                Delete Account
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-5">

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-fit place-self-center" variant="destructive">
                      delete account {loading && <Loader2 className="animate-spin" />}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem className="flex flex-row justify-center">
                        cancel
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleDeleteAccount} className="flex flex-row justify-center text-red-500 font-semibold">
                        delete
                    </DropdownMenuItem>



                  </DropdownMenuContent>

                </DropdownMenu>

              </AccordionContent>
            </AccordionItem>

            <AccordionItem disabled={isDisabled()} value="logout">
              <AccordionTrigger className={`${isDisabled() && "text-muted-foreground"}`}>
                    Logout
              </AccordionTrigger>

              <AccordionContent className="flex flex-row justify-center gap-5">
                <Button onClick={handleLogout} className="w-fit place-self-center" variant="destructive">
                  Logout
                </Button>
              </AccordionContent>
            </AccordionItem>



            <AccordionItem value="info">
              <AccordionTrigger>
                Additional Information
              </AccordionTrigger>
              <AccordionContent className="flex flex-row gap-5 justify-center">

                <Link className="font-semibold text-md text-blue-500 dark:text-blue-400" href={"/voidback/about-us"}>
                  about us
                </Link>

                <Separator orientation="vertical" className="h-[24px] w-[1px] bg-muted-foreground" />

                <Link className="font-semibold text-md text-blue-500 dark:text-blue-400" href={"/voidback/contact-us"}>
                  contact us
                </Link>
              </AccordionContent>
            </AccordionItem>


            <AccordionItem value="policies">
              <AccordionTrigger>
                Policies & Terms
              </AccordionTrigger>
              <AccordionContent className="flex flex-row gap-5 justify-center">

                <Link className="font-semibold text-md text-blue-500 dark:text-blue-400" href={"/voidback/privacy-policy"}>
                  Privacy Policy
                </Link>

                <Separator orientation="vertical" className="h-[24px] w-[1px] bg-muted-foreground" />

                <Link className="font-semibold text-md text-blue-500 dark:text-blue-400" href={"/voidback/terms-of-service"}>
                  Terms Of Service
                </Link>
              </AccordionContent>
            </AccordionItem>


          </Accordion>
        </div>
      } />

    </div>
  )
}


export default Page;
