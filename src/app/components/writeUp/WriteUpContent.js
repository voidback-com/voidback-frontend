'use client'
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useTheme } from "next-themes";
import { useEffect } from "react";


export const WriteUpContent = ({content}) => {

  const theme = useTheme();

  useEffect(()=> {
    if(theme.theme)
    {
      document.documentElement.setAttribute("data-color-mode", theme.theme);
    }
  }, [theme])


  return (
    <div className="w-[80svw] min-w-[350px] py-10 self-center">
      <MarkdownPreview 
        style={{backgroundColor: "transparent"}}
        source={content} 
      />
    </div>
  )
}
