'use client'
import { accountCacheGet, API_URL, toAuthHeaders } from "@/app/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Divide, Dot, Ellipsis, Flag, Pen, SeparatorVertical, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { shortRelativeTime } from "../helpers/DateTime";
import { ReportDialog } from "../ReportDialogs";
import { UserCard } from "../UserCard";
import { BottomBar } from "../writeUp/BottomBar";
import { Tags } from "../writeUp/Tags";
import ColorThief from 'colorthief'; // Or 'color-thief-react' if you use its hooks/components
import { SeriesCard } from "../writeUp/SeriesCard";



export const WriteUpCard = ({ writeup, firstRendered, snippet = false, noBorder }) => {


  const { title, description, thumbnail, id, author } = writeup;


  const [showReportModal, setShowReportModal] = useState(false);

  const [deleted, setDeleted] = useState(false);


  const { toast } = useToast();


  const account = accountCacheGet();


  const getCreatedAt = () => {
    return shortRelativeTime(writeup.created_at);
  }

  const handleDelete = async () => {
    const response = await fetch(API_URL + `writeup`, {
      method: "DELETE",
      headers: toAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ "id": id })
    })


    if (response.ok) {
      toast({
        title: "Write Up deleted successfully!"
      });
      setDeleted(true);
    }

    else {
      toast({
        title: "Failed to delete Write up!",
        description: errorToReadable(await response.json())
      })


    }
  }



  const router = useRouter();


  const imref = useRef(null);
  const [imgStyle, setImgStyle] = useState(false);
  const [loaded, setLoaded] = useState(false);


  const getImageStyle = async () => {
    if (!imref.current && !loaded) return;

    const color = new ColorThief();


    if (imref.current.complete) {
      const bg = await color.getColor(imref.current);

      setImgStyle({ borderRadius: 10, background: `rgba(${bg[0]}, ${bg[1]}, ${bg[2]})`, backdropFilter: "blur(10px)" });

    }

  }


  useEffect(() => {
    getImageStyle();
  }, [imref, !imgStyle, loaded])


  return (
    <>
      <Card
        className={`border-[0px] ${deleted && "opacity-25"} shadow-none rounded-none ${firstRendered ? "border-b" : "border-t"} ${snippet && "w-full"}  ${noBorder && "border-0"}`}
      >
        <CardHeader className="w-full max-h-fit">
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
                  <Ellipsis className="min-h-[20px] min-w-[20px]" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="relative right-5">

                <DropdownMenuItem onClick={() => setShowReportModal(!showReportModal)} className="w-full flex flex-row justify-between">
                  <Flag size={18} />

                  Report
                </DropdownMenuItem>


                {
                  account && account.username === author.username ?
                    <>
                      <DropdownMenuItem onClick={() => handleDelete()} className="w-full flex flex-row justify-between">
                        <Trash />

                        Delete
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => router.push(`/editor/update/${writeup.id}`)} className="w-full flex flex-row justify-between">
                        <Pen />

                        Edit
                      </DropdownMenuItem>
                    </>

                    : null

                }

              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div onClick={() => router.push(`/view/writeup/${writeup.id}`)} className="w-full h-fit pl-5 pt-5 p-2 flex flex-col">
            <CardTitle className="text-lg">
              {title}
            </CardTitle>

            {description &&
              <CardDescription className="font-robot place-self-start">
                {description}
              </CardDescription>
            }
          </div>

        </CardHeader>

        {!snippet && thumbnail?.thumbnail && thumbnail.thumbnail &&
          <CardContent onClick={() => router.push(`/view/writeup/${writeup.id}`)} className="flex flex-col gap-2">

            <div
              className={"w-full h-fit flex flex-row justify-center py-2 border"}
              style={imgStyle ? imgStyle : {}}
            >
              <Image

                loading="eager"
                className={`rounded-md w-[80svw] h-[80svw] max-w-[600px] max-h-[400px] object-cover animate-fade-up`}
                width={1600}
                height={900}
                src={thumbnail.thumbnail}
                alt={title}
                ref={imref}
                onLoadingComplete={() => setLoaded(true)}
              />
            </div>

          </CardContent>
        }

        <Tags tags={writeup.tags} readonly={true} />

        {
          writeup.series &&

          <div
            className="w-full flex flex-row justify-center"
          >
            <SeriesCard
              name={writeup.series.name}
            />
          </div>
        }

        <CardFooter className="flex flex-row p-0">

          <div className="w-full">
            <BottomBar id={writeup.id} />
          </div>
        </CardFooter>
      </Card>

      <ReportDialog object_id={id} object_type="writeup" show={showReportModal} setShow={setShowReportModal} />
    </>
  )
}
