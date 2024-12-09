'use client'
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Skeleton } from "@nextui-org/react";



export const metdata = {
  title: "Home",
  description: "Voidback's Home page.",
  referrer: "origin-when-cross-origin",
  keywords: ["finance", "quant", "voidback", "social media", "platform", "voidback login", "fintech", "data-hub", "data broker", "financial data", "realtime data", "stocks", "options", "stock market", "investments", "models", "quantitative analysis"]
}



const Home = () => {

  const { account, loading } = useContext(AuthContext);

  const router = useRouter();


  useEffect(()=> {
    if(!loading) return router.replace("/home/foryou");
  }, [account, loading])

  return (
    <Skeleton className="w-[100vw] h-[100vh]">
    </Skeleton>
  )

  }


export default Home;

