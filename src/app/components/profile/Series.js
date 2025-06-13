'use client'

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchUserSeries } from "../helpers/Profile";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ellipsis, Folder, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { accountCacheGet, API_URL, errorToReadable, toAuthHeaders } from "@/app/utils/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "react-responsive";



export const ProfileSeriesCard = ({ series }) => {

  const [deleted, setDeleted] = useState(false);


  const { toast } = useToast();


  const handleDelete = async () => {
    const response = await fetch(API_URL + "writeup/series/delete", {
      method: "DELETE",
      body: JSON.stringify({ "id": series.id }),
      headers: toAuthHeaders({ "Content-Type": "application/json" })
    });


    if (response.ok) {
      setDeleted(true);
      toast({
        title: "Successfully deleted the series!"
      });
    }

    else {
      toast({
        title: "Failed to delete series!",
        description: errorToReadable(await response.json())
      });
    }

  }


  if (!series || deleted)
    return null;


  const { author, name, id, created_at } = series;


  const router = useRouter();


  const account = accountCacheGet();


  return (
    <div
      className="self-center p-4 border-0 border-b rounded-none w-full flex flex-row justify-center"
    >

      <Button onClick={() => router.push(`/explore/series/${name}`)} variant="ghost" className="w-full rounded-none flex flex-row justify-start gap-3">
        <div className="flex flex-col justify-center">
          <Folder className="min-w-[25px] min-h-[25px]" />
        </div>

        <div className="flex flex-col justify-center">
          <p
            className="text-large"
          >
            {name}
          </p>
        </div>
      </Button>


      {

        account && account.username === author.username
          ?
          <DropdownMenu>

            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none"
              >
                <Trash />
              </Button>
            </DropdownMenuTrigger>


            <DropdownMenuContent
              className="w-full h-full"
            >
              <DropdownMenuItem
              >
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>

          </DropdownMenu>
          : null
      }

    </div>
  )

}




export default function SeriesList({ username, noPad }) {

  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);


  const getSeries = async () => {
    setLoading(true);

    const data = await fetchUserSeries(username);

    if (data) {
      setSeries(data);

      if (!data.length)
        setFailed(true);
    }
    else {
      setFailed(true);
    }

    setLoading(false);
  }


  useEffect(() => {
    if (!loading && !series.length && !failed) {
      getSeries();
    }
  }, [!loading])


  const isDesktop = useMediaQuery({ query: "(min-width: 768px) and (pointer: fine)" });


  if (series.length)
    return (
      <div className={`flex flex-col w-full max-h-[100%] gap-0 p-0 overflow-y-scroll ${!isDesktop && !noPad ? "pb-[1vh]" : ""}`}>
        {series.map((s) => {
          return <ProfileSeriesCard key={s.id} series={s} />
        })}
      </div>
    )
}

