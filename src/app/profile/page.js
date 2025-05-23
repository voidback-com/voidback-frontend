'use server'
import { cookies } from "next/headers";
import { NavigationBar } from "../components/Navigation"
import { redirect } from "next/navigation";
import { ProfileLayout } from "../components/profile/Layout";




export default async function Page() {


  const cookieStore = await cookies();

  const authTok = cookieStore.get("authTok")

  if(!authTok)
  {
    redirect("/");
  }


  return (
    <div className="w-full h-[100svh]">
      <NavigationBar selected="profile" feed={
        <ProfileLayout />
      } />
    </div>
  )
}
