'use server'
import { NavigationBar } from "@/app/components/Navigation";
import { TopBar } from "@/app/components/Navigation/topbar";
import { AccountLayout } from "@/app/components/profile/AccountLayout";
import { WriteUpList } from "@/app/components/writeUpList";
import { API_URL } from "@/app/utils/api-server";
import { notFound } from "next/navigation";




export async function generateMetadata({ params }) {

  const { series } = await params;


  return {
    title: decodeURI(series),
    description: decodeURI(series),

    openGraph: {
      title: decodeURI(series),
      description: decodeURI(series),
      url: `https://voidback.com/explore/series/${series}`,
      siteName: "Voidback",
      type: "book"
    },

    robots: {
      index: true, // Allow indexing (default)
      follow: true, // Allow following links (default)
      nocache: false, // Allow caching
    },
  }
}





export default async function Page({ params }) {

  const { series } = await params;


  const response = await fetch(API_URL + `writeup/list?series=${decodeURI(series)}&page_size=100`);

  if (!response.ok)
    return notFound();

  const { results } = await response.json();


  return (
    <div
      className="w-full h-[100svh] max-h-[100vh] flex flex-col justify-between"
    >

      <TopBar />

      <NavigationBar selected="" feed={
        <WriteUpList
          writeUps={results}
          hasMore={false}
          loading={false}
        />
      } />
    </div>

  )
}
