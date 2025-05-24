'use server'
import { AuthenticationDrawer } from "@/app/components/authentication/auth-drawer";
import { NavBack } from "@/app/components/helpers/NavBack";
import { NavigationBar } from "@/app/components/Navigation";
import { AccountLayout } from "@/app/components/profile/AccountLayout";
import { Bio } from "@/app/components/profile/Bio";
import { Connections } from "@/app/components/profile/Connections";
import ProfileTabs from "@/app/components/profile/Tabs";
import { ThemeSwitch } from "@/app/components/themeSwitch";
import { UserCard } from "@/app/components/UserCard";
import { API_URL } from "@/app/utils/api-server";
import { NotebookPen } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";




export async function generateMetadata({ params }) {

  const { username } = await params;


  const response = await fetch(API_URL+`account/getAccount/${username}`);


  if(response.status===404)
  {
    return {
      title: "Not Found",
      description: "This Account doesn't exist!"
    };
  }


  const data = await response.json();


  return {
      title: data.full_name,
      description: data.bio,

      openGraph: {
        title: data.full_name,
        description: data.bio,
        images: data.avatar && [{ url: data.avatar, alt: data.full_name }],
        url: `https://voidback.com/view/account/${username}`,
        siteName: "Voidback",
        type: "profile"
      },

      robots: {
          index: true, // Allow indexing (default)
          follow: true, // Allow following links (default)
          nocache: false, // Allow caching
        },
    }
}




export default async function Page ({ params }) {

  const { username } = await params;


  const cookieStore = await cookies();

  const authTok = cookieStore.get("authTok")


  const response = await fetch(API_URL+`account/getAccount/${username}`);

  const account = await response.json();


  return (
    <div
      itemScope
      itemType="Person"
      className="w-full h-[100svh] max-h-[100vh] flex flex-col justify-between"
    >
      <NavigationBar selected="" feed={<AccountLayout account={account} />} />
  </div>

  )
}


