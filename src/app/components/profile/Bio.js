'use client'

import { accountCacheGet } from "@/app/utils/api"
import { Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAccountByUsername } from "../helpers/Profile";




export const Bio = ({username}) => {

  const [account, setAccount] = useState(accountCacheGet());
  const [loading, setLoading] = useState(true);

  const fetchAccount = async () => {

    const response = await getAccountByUsername(username);

    if(response.ok)
    {
      setAccount(await response.json());
    }
    setLoading(false);
  }


  useEffect(()=> {
    if(username)
      fetchAccount();
  }, [username])

  if(username && !account && !loading) return;

  return (
    <div className="w-fit flex flex-col gap-4">
      { account && account.bio &&
      <p className="font-roboto text-md text-foreground">{account.bio}</p>
      }

      {account && account.site_link ? (
        <div className="flex flex-row gap-2">
          <div className="h-full flex flex-col justify-center">
            <Link2 />
          </div>

          <div className="h-full flex flex-col justify-center">
            <a target="_blank" className="font-semibold text-sm dark:text-blue-300 text-blue-500" href={account.site_link}>
              {account.site_link}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )


}




