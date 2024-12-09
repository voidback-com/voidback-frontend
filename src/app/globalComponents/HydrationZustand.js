'use client'
import { useState, useEffect } from "react";



const HydrationZustand = ({children}) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(()=> {
    setIsHydrated(true);
  }, [])


  return <>{isHydrated ? children : null}</>
}


export default HydrationZustand;

// reference: https://medium.com/intelliconnect-engineering/fixing-hydration-issues-in-next-js-and-zustand-a-simple-solution-bd0a8deff6cc
