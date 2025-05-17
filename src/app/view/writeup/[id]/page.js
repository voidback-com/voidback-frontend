'use server'
import { AuthenticationDrawer } from "@/app/components/authentication/auth-drawer";
import { NavBack } from "@/app/components/helpers/NavBack";
import { ThemeSwitch } from "@/app/components/themeSwitch";
import { UserCard } from "@/app/components/UserCard";
import { BottomBar } from "@/app/components/writeUp/BottomBar";
import { WriteUpContent } from "@/app/components/writeUp/WriteUpContent";
import { API_URL } from "@/app/utils/api-server";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dot, Heart, NotebookPen } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";




export async function generateMetadata({ params }) {

  const { id } = await params;


  const response = await fetch(API_URL+`getWriteUp?id=${id}`);


  if(response.status===404)
  {
    return {
      title: "Not Found",
      description: "This write-up doesn't exist!"
    };
  }


  const data = await response.json();


  return {
      title: data.title,
      description: data.description,

      openGraph: {
        title: data.title,
        description: data.description,
        images: data.thumbnail.thumbnail && [{ url: data.thumbnail.thumbnail, alt: data.title }],
        url: `https://voidback.com/view/writeup/${id}`,
        siteName: "Voidback",
        type: "article"
      },

      robots: {
          index: true, // Allow indexing (default)
          follow: true, // Allow following links (default)
          nocache: false, // Allow caching
        },
    }
}




export default async function Page ({ params }) {

  const { id } = await params;



  const cookieStore = await cookies();

  const authTok = cookieStore.get("authTok")


  const headers = Object();


  headers["Authorization"] = authTok ? `Token ${JSON.parse(authTok.value).token}` : null;


  const response = await fetch(API_URL+`getWriteUp?id=${id}`, {
    headers: authTok && headers
  });


  const writeup = await response.json();


  const hdate = require("human-date");


  return (
    <div
      itemScope
      itemType="Article"
      className="w-full h-[100svh] max-h-[100vh] flex flex-col justify-between"
    >

      {/* top bar */}
     <div className="w-full h-[10svh] p-4 flex flex-row gap-5 border-b shadow-none justify-between fixed top-0 z-[40] bg-background">

        <div className="w-fit flex flex-row gap-3">
          <div className="h-full flex flex-col justify-center">
            <img
              src="/logo.png"
              className="w-[50px] animate-spin animate-once animate-ease-in-out"
            />
          </div>

          <div className="h-full flex flex-col justify-center h-full gap-0 space-y-0">
            <p className="text-[25px]" style={{fontWeight: 800}}>Voidback.</p>

            <p className="font-black w-fit self-start pl-1 text-[11px] font-roboto font-black">A platform by nerds for nerds.</p>
          </div>
        </div>

          

        <div className="h-full w-fit flex flex-row gap-2">

          <div className="w-fit h-full flex flex-col justify-center">
            { authTok

              ?
                <Link href={"/editor"} className="w-fit h-fit">
                  <NotebookPen size={18} />
                </Link>
              :
                <AuthenticationDrawer />
            }
          </div>

          <div className="w-fit h-full flex flex-col justify-center">
            <ThemeSwitch />
          </div>
        </div>
      </div>


      <div className="w-full h-full flex flex-col pt-[10vh]">

        <div className="w-full flex flex-row pt-5 pb-5 pl-2 justify-between">

          <div className="flex flex-row gap-2">
            <div className="flex flex-col justify-center p-2">
              <NavBack />
            </div>

            <UserCard 
              username={writeup.author.username}
              fullName={writeup.author.full_name}
              avatarUrl={writeup.author.avatar}
            />
          </div>


          <div className="flex flex-row pr-6">
            <div className="flex flex-col justify-center p-1">
              <p className="text-xs font-semibold text-muted-foreground">{writeup.edited ? "edited " : ""}{writeup.edited ? hdate.relativeTime(writeup.updated_at) : hdate.relativeTime(writeup.created_at)}</p>
            </div>

          </div>
        </div>


        {/* title, description and thumbnail */}
        <div className="flex flex-col w-full h-fit gap-4 p-5">
          <div className="w-full flex flex-row justify-center">
            <p className="font-semibold text-xl">
              {writeup.title}
            </p>

          </div>
          
          <div className="w-full flex flex-row justify-center">
            <p className="font-normal text-sm text-muted-foreground font-roboto max-w-[600px]">
              {writeup.description}
            </p>
          </div>

          {
            writeup.thumbnail.thumbnail
              ?
              <div className="w-full flex flex-row justify-center">
                <Image
                  loading="eager"
                  className="rounded-xl w-[80svw] h-[80svw] max-w-[600px] max-h-[400px] object-cover"
                  width={1600}
                  height={900}
                  src={writeup.thumbnail.thumbnail}
                  alt={writeup.title}
                />
              </div>
            :
              null
          }
        </div>


        {/* Write Up content */}
        <WriteUpContent content={writeup.content} />

        <BottomBar id={writeup.id} />

      </div>

    </div>

  )
}


