'use client'
import { useRouter } from "next/navigation";



const Page = () => {
  document.title = "Voidback";

  const router = useRouter();

  return router.replace("/home");
}


export default Page;
