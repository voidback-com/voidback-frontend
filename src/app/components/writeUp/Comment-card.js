'use client'

import { accountCacheGet, API_URL, errorToReadable, toAuthHeaders } from "@/app/utils/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu"
import { Delete, Flag, MoreHorizontal, Trash } from "lucide-react"
import { useState } from "react"
import { ReportDialog, submitReport } from "../ReportDialogs"
import { UserCard } from "../UserCard"
import { CommentBottomBar } from "./Comment-Bottom-Bar"






export const CommentCard = ({ comment, noBorder }) => {

  const account = accountCacheGet();

  const [showReport, setShowReport] = useState(false);
  const [deleted, setDeleted] = useState(false);


  const { toast } = useToast();


  const handleDelete = async () => {
    const response = await fetch(API_URL + `writeup/comment`, {
      method: "DELETE",
      headers: toAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ "id": comment.id })
    })


    if (response.ok) {
      "Commented deleted successfully!"
      toast({
      });
      setDeleted(true);
    }

    else {
      toast({
        title: "Failed to delete comment!",
        description: errorToReadable(await response.json())
      })


    }
  }


  if (deleted)
    return null;



  return (
    <>
      <Card className={`shadow-none border-none rounded-none max-w-[600px] place-self-center w-full ${noBorder && "border-0"}`}>
        <CardHeader className="w-full flex flex-row justify-between">
          <UserCard
            username={comment.author.username}
            fullName={comment.author.full_name}
            avatarUrl={comment.author.avatar}
          />


          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="border bg-background rounded-xl p-2">
              <DropdownMenuItem onClick={() => setShowReport(true)} className="w-full flex flex-row justiby-between">
                Report <Flag />
              </DropdownMenuItem>

              {
                account && account.username === comment.author.username ?
                  <DropdownMenuItem onClick={() => handleDelete()} className="w-full flex flex-row justiby-between">
                    Delete <Trash />
                  </DropdownMenuItem>

                  : null

              }
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="p-1 pl-5">
          <p className="font-roboto">{comment.comment}</p>
        </CardContent>

        <CardFooter className="p-0">
          <CommentBottomBar id={comment.id} wid={comment.writeup} />
        </CardFooter>
      </Card>

      <ReportDialog object_type={"writeup-comment"} object_id={comment.id} setShow={setShowReport} show={showReport} />
    </>
  )
}
