'use server'
import { NavigationBar } from "@/app/components/Navigation";
import { AccountLayout } from "@/app/components/profile/AccountLayout";
import { API_URL } from "@/app/utils/api-server";
import { notFound } from "next/navigation";




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



  const response = await fetch(API_URL+`account/getAccount/${username}`);


  if(!response.ok)
    return notFound();


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


