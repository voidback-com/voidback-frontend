import { Text } from "@chakra-ui/react";
import Link from "next/link";




export const text_type = 1;
export const mention_type = 2;
export const symbol_type = 3;
export const hashtag_type = 4;
export const link_type = 5;



const TextNode = ({content, gap}) => {
  if(gap)
    return (
      <Text>{content} </Text>
    )
  return <Text>{content}</Text>
}


const MentionNode = ({content, gap}) => {
    if(gap)
      return (
      <Link href={`/view/account/${content.replace("@", "")}`}>
        <Text 
          className="font-semibold text-primary-400"
        >{content} </Text>
      </Link>
      )
    return (
      <Link href={`/view/account/${content.replace("@", "")}`}>
        <Text 
          className="font-semibold text-primary-400"
        >{content}</Text>
      </Link>
      )
}

const HashtagNode = ({content, gap}) => {
  if(gap)
    return <Link href={`/view/hashtag/${content.replace("#", "")}`}><Text className="font-semibold text-primary-500">{content} </Text></Link>
  return <Link href={`/view/hashtag/${content.replace("#", "")}`}><Text className="font-semibold text-primary-500">{content}</Text></Link>
}




const SymbolNode = ({content, gap}) => {
  if(gap)
    return (
      <Link href={`/view/account/${content.replace("$", "")}`}>
        <Text 
        className="font-semibold text-emerald-500"
        style={{
          textTransform: "uppercase"
        }}
        >{content} </Text>
      </Link>
    )

  return (
    <Link href={`/view/account/${content.replace("$", "")}`}>
      <Text 
      className="font-semibold text-emerald-500"
      style={{
        textTransform: "uppercase"
      }}
      >{content}</Text>
    </Link>
    )
  
}




export const renderNode = (node, gap) => {

  switch(node.type)
  {
    case text_type:
      return <TextNode key={node.index} content={node.content} gap={gap} />;

    case mention_type:
      return <MentionNode key={node.index} content={node.content} gap={gap} />;

    case hashtag_type:
      return <HashtagNode key={node.index} content={node.content} gap={gap} />;

    case symbol_type:
      return <SymbolNode key={node.index} content={node.content} gap={gap} />;

  }
}



export const renderNodes = (nodes) => {
  if(nodes.length)
  {
    return nodes.map((node, i)=> {
      if(nodes.length != i+1)
        return renderNode(node, true);
      return renderNode(node, false);
    })
  }
  return null;
}


