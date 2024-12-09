'use client'
import { useRouter } from "next/navigation";


export const metdata = {
  title: "Voidback",
  description: "Voidback.",
  referrer: "origin-when-cross-origin",
  keywords: ["finance", "quant", "voidback", "social media", "platform", "voidback login", "fintech", "data-hub", "data broker", "financial data", "realtime data", "stocks", "options", "stock market", "investments", "models", "quantitative analysis"]
}



const Page = () => {

  const router = useRouter();

  return router.replace("/home");
}


export default Page;
