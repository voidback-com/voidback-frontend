'use client'
import { accountCacheGet } from "@/app/utils/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Folder, Heart, ListVideo, Lock, Notebook, Pen, Pickaxe } from "lucide-react"
import { ProfileWriteUps } from "./WriteUps";
import { ProfileLiked } from "./Liked";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";
import SeriesList from "./Series";





export default function ProfileTabs({ username, ref, translateY, scrolling, setActiveTab, activeTab }) {

  const acc = accountCacheGet();

  const account_username = !username && acc?.username ? acc.username : username;

  const isDesktop = useMediaQuery({ query: "(hover: hover) and (pointer: fine" });

  return (

    <motion.nav style={{ y: translateY, willChange: true }} className="w-full">
      <Tabs
        onValueChange={(v) => setActiveTab(v)}
        defaultValue={activeTab}
        value={activeTab}
        activationMode="manual"
        className="w-full bg-background relative"
      >

        <TabsList className={`w-full bg-background border-b rounded-none flex flex-row justify-center gap-5`}>

          <TabsTrigger value="write-ups" className="text-[16px] data-[state=active]:border-b-[3px] rounded-none shadow-none border-b-foreground flex flex-row gap-4">Write ups <Notebook /></TabsTrigger>

          <TabsTrigger value="liked" className="text-[16px] data-[state=active]:border-b-[3px] rounded-none shadow-none border-b-foreground flex flex-row gap-4">Liked <Heart /></TabsTrigger>


          <TabsTrigger value="series" className="text-[16px] data-[state=active]:border-b-[3px] rounded-none shadow-none border-b-foreground flex flex-row gap-4">Series <Folder /></TabsTrigger>
        </TabsList>



        <div ref={ref} className={`overflow-y-auto ${!isDesktop ? "pb-[15vh]" : "pb-[13vh]"}`} style={{ height: 'calc(100svh)' }}>

          <TabsContent value="write-ups" className={cn(activeTab !== "write-ups" && "hidden")}>
            <ProfileWriteUps username={account_username} />
          </TabsContent>

          <TabsContent value="liked" className={cn(activeTab !== "liked" && "hidden")}>
            <ProfileLiked username={account_username} />
          </TabsContent>

          <TabsContent value="series" className={cn(activeTab !== "series" && "hidden")}>

            <SeriesList username={account_username} />
          </TabsContent>

        </div>



      </Tabs>
    </motion.nav>
  )

}
