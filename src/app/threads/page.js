'use client'

import { Pickaxe } from "lucide-react";
import { NavigationBar } from "../components/Navigation";


const Page = () => {


  return (
    <div className="w-[100svw] h-[100svh] bg-background">

      <NavigationBar selected="threads" feed={
        <div className="h-full w-full p-10 flex flex-col">

        <p className="w-fit flex flex-row gap-3 font-semibold self-center">
          Coming soon <Pickaxe />
        </p>


        </div>
      } />

    </div>
  )
}


export default Page;
