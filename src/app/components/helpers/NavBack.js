'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { useState } from "react";





export const NavBack = () => {

  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    // Check if there's any history entries available
    // window.history.length is a good indicator, though not foolproof for all edge cases
    setHasHistory(window.history.length > 1);
  }, []);


  const router = useRouter();

  const goBack = () => {

    if (hasHistory) {
      router.back();
    }

    else {
      router.push("/home")
    }

  }

  return (
    <Button
      size="icon"
      onClick={goBack}
      variant="outline"
    >
      <ArrowLeft />
    </Button>
  )
}




