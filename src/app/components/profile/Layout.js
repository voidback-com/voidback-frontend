'use client'

import { useEffect, useRef, useState } from "react"
import { AuthUserCard } from "../UserCard"
import { Bio } from "./Bio"
import { Connections } from "./Connections"
import { Editor } from "./Editor"
import ProfileTabs from "./Tabs"
import { motion, useScroll, useTransform } from "framer-motion";


export const ProfileLayout = () => {

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
    <div className="w-full flex flex-col h-[100svh] p-0 gap-0 relative transform-3d">


      {/* top section */}
      <motion.div ref={topsec} className="w-full flex flex-col h-full justify-between p-10">

        <div className="w-full flex flex-col gap-5">

          <div className="w-full flex flex-col gap-5">

            <div className="w-fit flex flex-row gap-5">

              <AuthUserCard />
              <Editor />

            </div>

            <Bio />
          </div>

          <Connections />
        </div>
      </motion.div>

      <ProfileTabs
        scrolling={currentScrollY > 0}
        ref={scrollRef} translateY={currentScrollY && currentScrollY < topsec.current.clientHeight ? -currentScrollY : currentScrollY ? -topsec.current.clientHeight : 0}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </div>
  )

}
