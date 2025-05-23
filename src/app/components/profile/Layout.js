'use client'

import { AuthUserCard } from "../UserCard"
import { Connections } from "./Connections"
import ProfileTabs from "./Tabs"



export const ProfileLayout = () => {


  return (
    <div className="w-full flex flex-col h-[100svh] p-0">

      <div className="w-full flex flex-col justify-between p-10">
        <AuthUserCard />
        <Connections />
      </div>

      <ProfileTabs />
    </div>
  )

}
