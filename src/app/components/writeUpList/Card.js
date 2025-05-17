'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Separator } from "@radix-ui/react-separator";
import { Divide, Dot, Ellipsis, Flag, SeparatorVertical } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WriteUpReportDialog } from "../ReportDialogs";
import { UserCard } from "../UserCard";
import { BottomBar } from "../writeUp/BottomBar";




export const WriteUpCard = ({writeup, firstRendered, snippet=false}) => {


  const { title, description, thumbnail, id, author } = writeup;


  const [showReportModal, setShowReportModal] = useState(false);



  const hdate = require("human-date");

  const getCreatedAt = () => {

    const created_at = hdate.relativeTime(writeup.created_at, {"returnObject": true});

    if(created_at.years > 0)
    {
      return `${created_at.years}y`;
    }

    else if(created_at.days >= 30)
    {
      return `${created_at.days/30}`
    }

    else if(created_at.days > 0)
    {
      return `${created_at.days}d`;
    }

    else if(created_at.hours > 0)
    {
      return `${created_at.hours}h`;
    }

    else if((created_at.seconds / 60) >= 1)
    {
      return `${(created_at.seconds/60)}m`;
    }

    else{
      return "now";
    }

  }

  const router = useRouter();


  return (
    <>
      <Card
        className={`border-[0px] shadow-none rounded-none ${firstRendered ? "border-b" : "border-t"} ${snippet && "w-full"}`}

      >
        <CardHeader className="w-full max-h-fit p-4">
          <div className="w-full flex flex-row justify-between">

            <div className="flex flex-row">
              <UserCard
                username={author.username}
                fullName={author.full_name}
                avatarUrl={author.avatar}
                verified={author.isVerified}
              />

              <div className="flex flex-col justify-center">
                <Dot className="stroke-muted-foreground" />
              </div>

              <div className="w-fit flex flex-row gap-0">

                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-semibold text-muted-foreground">{getCreatedAt()}</p>
                  </div>

              </div>
            </div>


          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
                className="flex flex-col justify-center pt-1"
            >
              <Button
                variant="ghost"
                size="icon"
              >
                <Ellipsis className="fill-red-200 min-h-[20px] min-w-[20px]" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-full h-full flex flex-row justify-between relative right-5 rounded-lg p-0">
              <DropdownMenuItem onClick={()=>setShowReportModal(!showReportModal)} className="border p-2 rounded-xl flex flex-row justify-between w-full gap-4 bg-background">
                <div className="h-full flex flex-col justify-center">
                  <Flag size={18} />
                </div>

                <DropdownMenuLabel className="font-semibold">
                  Report 
                </DropdownMenuLabel>


              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>

          <div onClick={()=>router.push(`/view/writeup/${writeup.id}`)} className="w-full h-fit pl-4 p-2 flex flex-col">
            <CardTitle className="text-lg">
              {title}
            </CardTitle>

            <CardDescription className="font-robot place-self-start">
              {description}
            </CardDescription>
          </div>

        </CardHeader>

          { !snippet && thumbnail.thumbnail &&
            <CardContent onClick={()=>router.push(`/view/writeup/${writeup.id}`)} className="flex flex-col gap-2 pl-5">

                <div className="w-full h-fit flex flex-row justify-center py-2">
                  <Image
                    loading="eager"
                    className="rounded-xl w-[80svw] h-[80svw] max-w-[600px] max-h-[400px] object-cover"
                    width={1600}
                    height={900}
                    src={thumbnail.thumbnail}
                    alt={title}
                  />
                </div>

            </CardContent>
          }

        <CardFooter className="flex flex-row p-2">

            <div className="w-full">
              <BottomBar id={writeup.id} />
            </div>
        </CardFooter>
      </Card>

      <WriteUpReportDialog writeUpId={id} show={showReportModal} setShow={setShowReportModal} />
    </>
  )
}
