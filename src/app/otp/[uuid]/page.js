'use server'
import { NavBack } from "@/app/components/helpers/NavBack";
import { API_URL, toAuthHeaders } from "@/app/utils/api-server";
import { BadgeCheck } from "lucide-react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";


export default async function Page ({ params }) {

  const { uuid } = await params;


  const cookieStore = await cookies();

  const authTok = cookieStore.get("authTok")


  const response = await fetch(API_URL+"account/verifyOtp", {
    method: "POST",
    headers: toAuthHeaders({"Content-Type": "application/json"}, authTok.value),
    body: JSON.stringify({otp: uuid})
  });

  if(response.ok)
  {
    return (
      <div className="w-full h-[100svh] max-h-[100vh] flex flex-col p-10">
        <div className="w-full flex flex-row justify-start">
          <NavBack />
        </div>

        <div className="w-full flex flex-row justify-center">
          <BadgeCheck className="min-w-[128px] min-h-[128px] animate-bounce animate-ease-in" />
        </div>

        <div className="w-full flex flex-row justify-center">
          <p className="font-semibold text-xl">Successfully verified otp!</p>
        </div>

      </div>
    )
  }

  else{
    return notFound();
  }
}


