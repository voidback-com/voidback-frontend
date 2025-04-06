'use client'
import { useRouter } from "next/navigation";
import { Touchable } from "../auth/components";
import { IoMdArrowRoundBack } from "@react-icons/all-files/io/IoMdArrowRoundBack";




export const NavBack = ({home}) => {

  const router = useRouter();


  return (

      <Touchable
        onPress={()=>home?router.push("/home"):router.back()}
        className="bg-background"
        style={{
          padding: 2,
          borderRadius: 6
        }}
      >
        <IoMdArrowRoundBack size={25} />
      </Touchable>


  )
}

