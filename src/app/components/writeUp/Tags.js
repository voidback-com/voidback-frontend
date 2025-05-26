'use client'

import { Badge } from "@/components/ui/badge"



export const Tag = ({tag, readonly, handleDelete}) => {

  return (
    <Badge onDoubleClick={()=>!readonly ? handleDelete(tag) : null}>
      {tag}
    </Badge>
  )
}


export const Tags = ({tags, readonly, handleDelete}) => {

  if(!tags || !tags.length)
    return null;


  const renderTags = () => {
    return tags.map((tag, i)=> {
      return <Tag tag={tag.tag} readonly={readonly} handleDelete={handleDelete} key={i} />
    })
  }

  return (
    <div className={`w-full h-fit flex flex-wrap gap-3 p-2 ${!readonly ? "border": "min-w-full max-w-full justify-center"} rounded-md p-5 max-w-[350px]`}>
      {!readonly ? <p className="w-full pb-5 text-sm text-muted-foreground">(Double click to remove a tag)</p> : null}
      {renderTags()}
    </div>
  )
}
