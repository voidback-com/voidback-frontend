'use client'

import { AppCard } from "./AppCard"


export const AppCardList = ({apps}) => {


  return (
    <div className="w-full h-full flex flex-wrap p-10">
      {
        apps.length ?
          apps.map((app, i)=> {
            return <AppCard key={i} app={app} />
          })
        :
          null
      }
    </div>
  )
}
