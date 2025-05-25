'use client'

import { useRef, useEffect, useState } from "react"
import { UserCard } from "../UserCard"
import { Bio } from "./Bio"
import { Connections } from "./Connections"
import ProfileTabs from "./Tabs"
import { motion, useScroll, useTransform } from "framer-motion";


export const AccountLayout = ({account}) => {


  const [activeTab, setActiveTab] = useState("write-ups");

  const scrollRef = useRef(null);

  const { scrollY } = useScroll({ container: scrollRef, layoutEffect: false });

  const [currentScrollY, setCurrentScrollY] = useState(0);


  useEffect(() => {

    const unsubscribe = scrollY.on("change", (latest) => {
      setCurrentScrollY(latest);
    });
    return () => unsubscribe();
  }, [scrollY, scrollRef, activeTab]);


  const topsec = useRef(null);



  return (
    <div className="w-full flex flex-col h-[100svh] p-0 gap-0 transform-3d">


      <motion.div ref={topsec} className="w-full flex flex-col h-full justify-between p-10">
        <div className="w-full flex flex-col gap-5">
          <div className="w-full flex flex-col gap-5">
            <div className="w-fit flex flex-row gap-5">
              <UserCard
                username={account.username}
                fullName={account.full_name}
                avatarUrl={account.avatar}
                showUnfollow
              />
            </div>
            
            <Bio username={account.username} />
          </div>

          <Connections username={account.username} />
        </div>
      </motion.div>


      <ProfileTabs 
        scrolling={currentScrollY>0} 
        username={account.username}
        ref={scrollRef} translateY={currentScrollY && currentScrollY < topsec.current.clientHeight ? -currentScrollY : currentScrollY ? -topsec.current.clientHeight : 0} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />


    </div>
  )

}
