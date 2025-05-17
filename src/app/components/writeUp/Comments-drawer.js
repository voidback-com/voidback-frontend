'use client'
import { API_URL, errorToReadable, toAuthHeaders } from "@/app/utils/api"
import { Button } from "@/components/ui/button"
import { DrawerClose, Drawer, DrawerContent, DrawerFooter, DrawerDescription, DrawerTitle, DrawerHeader } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import clsx from "clsx"
import { ArrowUp, Loader2, Plane, SendHorizonal } from "lucide-react"
import { useState } from "react"
import { CommentsList } from "./Comments-list"




export const CommentsDrawer = ({isOpen, setIsOpen, count, wid, commentId=null}) => {

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);


  const [comments, setComments] = useState([]);



  const { toast } = useToast();


  const handleComment = async () => {

    setLoading(true);


    const data = {
      writeup: wid,
      comment: comment,
      parent: commentId ? commentId : null
    };

    const response = await fetch(API_URL+`writeup/comment`, {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify(data)
    });


    if(!response.ok)
    {
      toast({
        title: "Comment failed!",
        description: errorToReadable(await response.json())
      });
    }

    else{
      setComment("");

      toast({
        title: "Comment sent!"
      });

      const myComment = await response.json();

      if(comments.length)
        setComments(p=>[myComment, ...p]);

      else
        setComments([myComment]);
    }

    setLoading(false);

  }


  const num = require("human-readable-numbers");

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="h-[100svh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{commentId ? "Replies" : "Comments"} {count!==false ? `(${num.toHumanString(count)})` : ""}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>

            <div className="w-full h-full flex flex-col justify-between">

              {/* comments infinite scroll here... */}
              <CommentsList 
                setComments={setComments} 
                comments={comments} 
                wid={wid}
              commentId={commentId}
              />

              <div className="w-full flex flex-row b-5 border-t pb-[5vh] p-3 justify-center fixed bottom-0 z-[50] bg-background">
                <Textarea
                  disabled={loading}
                  value={comment}
                  className={clsx(
                'mt-3 block h-[12vh] w-full resize-none rounded-lg px-3 py-1.5 text-sm/6 text-white',
                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
                    "max-w-[600px] place-self-center text-xl"
              )}
                placeholder="comment..." 
                onChange={(e)=>setComment(e.target.value)}
              />


                <div className="min-h-full flex flex-col justify-end p-2">
                  {
                    loading
                    ?
                      <Loader2 className="animate-spin" />
                    :
                      <Button
                        onClick={()=>handleComment()}
                        disabled={!comment.length}
                        size="icon"
                        variant="gost"
                        className="bg-foreground rounded-full"
                      >
                        <ArrowUp className="stroke-background" />
                      </Button>
                  }
                </div>
              </div>
            </div>
      </DrawerContent>
    </Drawer>
  )
}
