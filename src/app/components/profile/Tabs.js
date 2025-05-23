'use client'

import { accountCacheGet } from "@/app/utils/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ListVideo, Lock, Notebook, Pen, Pickaxe } from "lucide-react"
import { ProfileWriteUps } from "./WriteUps";




export default function ProfileTabs({username}) {

  const acc = accountCacheGet();

  const account_username = !username && acc?.username ? acc.username : username;


  return (
    <Tabs defaultValue="write-ups" className="w-full">
      <TabsList className="w-full bg-background border-b rounded-none flex flex-row justify-center gap-5">

        <TabsTrigger value="write-ups" className="text-[16px] data-[state=active]:border-b-[3px] rounded-none shadow-none border-b-foreground flex flex-row gap-4">Write ups <Notebook /></TabsTrigger>

        <TabsTrigger value="liked" className="text-[16px] data-[state=active]:border-b-[3px] rounded-none shadow-none border-b-foreground flex flex-row gap-4">Liked <Heart /></TabsTrigger>


        <TabsTrigger value="series" className="text-[16px] data-[state=active]:border-b-[3px] rounded-none shadow-none border-b-foreground flex flex-row gap-4">Series <ListVideo /></TabsTrigger>
      </TabsList>



      <TabsContent value="write-ups">
        <ProfileWriteUps username={account_username} />
      </TabsContent>

      <TabsContent value="liked" className="bg-red-200 w-full min-h-[100%]">

      </TabsContent>

      <TabsContent value="series" className="w-full min-h-[100%] flex flex-col justify-center">
        <p className="w-fit flex flex-row gap-3 font-semibold self-center">
          Coming soon <Pickaxe />
        </p>
      </TabsContent>



    </Tabs>
  )

}
