'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"




export const NavBack = () => {


  const router = useRouter();

  return (
    <Button 
      size="icon"
      onClick={()=>router.back()}
      variant="outline"
    >
      <ArrowLeft />
    </Button>
  )
}




