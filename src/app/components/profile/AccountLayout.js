'use client'

import { UserCard } from "../UserCard"
import { Bio } from "./Bio"
import { Connections } from "./Connections"
import ProfileTabs from "./Tabs"


export const AccountLayout = ({account}) => {


  return (
    <div className="w-full flex flex-col h-[100svh] p-0 gap-0">

      <div className="w-full flex flex-col justify-between p-10">

        <div className="w-full flex flex-col gap-5">
          <div className="w-full flex flex-col gap-5">
            <div className="w-fit flex flex-row gap-5">
              <UserCard
                username={account.username}
                fullName={account.full_name}
                avatarUrl={account.avatar}
                showUnfollow
              />
            </div>
            
            <Bio username={account.username} />
          </div>

          <Connections username={account.username} />
        </div>
      </div>

      <ProfileTabs username={account.username} />
    </div>
  )

}
