'use client'

import { AppCardList } from "./AppCardList";




export const AppsList = ({data}) => {

  const apps = data.results?.length ? data.results : [];

  console.log(apps)

  return (
    <div className="w-[100svw] min-h-[100svh] flex flex-col overflow-y-scroll">
      <AppCardList apps={apps} />
    </div>
  )
}
