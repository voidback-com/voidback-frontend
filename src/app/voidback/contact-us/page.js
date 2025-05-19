'use client'
import { NavigationBar } from "@/app/components/Navigation"
import { useEffect, useState } from "react"





export default function Page() {


  return (
    <div className="w-full h-[100svh]">

      <NavigationBar selected="profile" feed={
        <div className="w-full bg-red-200 h-[100svh] p-0">
        </div>
      } />
    </div>
  )
}
