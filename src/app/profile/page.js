'use client'
import { useEffect, useState } from "react"
import { NavigationBar } from "../components/Navigation"




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
