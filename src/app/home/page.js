'use client'
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Skeleton } from "@nextui-org/react";




const Home = () => {

  document.title = "Home";

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

