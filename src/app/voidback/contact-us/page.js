'use client'
import { NavigationBar } from "@/app/components/Navigation"
import { useEffect, useState } from "react"




export default function Page() {


  return (
    <div className="w-full h-[100svh]">

      <NavigationBar selected="settings" feed={
        <div className="w-full h-[100svh] p-10 flex flex-col overflow-y-scroll gap-10">
          <p className="font-black text-5xl">
            Voidback.
          </p>

            <div className="">
              <div class="max-w-4xl mx-auto px-4 py-8">
                <p class="mb-4 text-lg font-roboto leading-relaxed">
                Contact us at: <a className="text-blue-400 light:text-blue-500 font-semibold" href="mailto: contact@voidback.com">contact@voidback.com</a>
                </p>
              </div>


          </div>
        </div>
      } />
    </div>
  )
}
