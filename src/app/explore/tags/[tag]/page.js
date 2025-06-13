'use server'
import { NavigationBar } from "@/app/components/Navigation";
import { TopBar } from "@/app/components/Navigation/topbar";
import { AccountLayout } from "@/app/components/profile/AccountLayout";
import TagsWriteUps from "@/app/components/writeUp/TagsWriteUp";
import { WriteUpList } from "@/app/components/writeUpList";
import { API_URL } from "@/app/utils/api-server";
import { notFound } from "next/navigation";




export async function generateMetadata({ params }) {

  const { tag } = await params;


  return {
    title: decodeURI(tag),
    description: decodeURI(tag),

    openGraph: {
      title: decodeURI(tag),
      description: decodeURI(tag),
      url: `https://voidback.com/explore/tags/${tag}`,
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






export default async function Page({ params }) {

  const { tag } = await params;


  return (
    <div
      className="w-full h-[100svh] max-h-[100vh] flex flex-col justify-between"
    >
      <TopBar />

      <NavigationBar selected="" feed={
        <TagsWriteUps tag={tag} />
      } />
    </div>

  )
}


