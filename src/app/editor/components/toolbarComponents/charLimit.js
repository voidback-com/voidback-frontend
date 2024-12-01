import { CircularProgress } from "@nextui-org/react";
import { useState, useEffect } from "react";





export default function CharLimit ({text}) {

  const [color, setColor] = useState("success");

  useEffect(()=> {

    if(text && text.length>=1000 || text && text.length<= 1500)
      setColor("success")

    if(text && text.length>=1500)
        setColor("warning")

    if(text && text.length>=2500)
        setColor("danger")

  }, [text])

  return (
    <CircularProgress
      value={text && text.length}
      color={color}
      formatOptions={{style: "decimal"}}
      showValueLabel={true}
      maxValue={3000}
    />
  )
}
