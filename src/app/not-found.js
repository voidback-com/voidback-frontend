"use client"

import { NavBack } from "./components/helpers/NavBack"


export default function NotFound() {
  return (
    <div className='bg-background'>

      <div className="p-5 w-full flex flex-row justify-start">
        <NavBack />
      </div>

      <div
        className='w-full h-[100%] bg-background flex flex-col justify-start py-10'
      >
        <div
          className='w-[100svw] flex flex-row justify-center'
        >
          <div className='flex flex-col'>
            <img src={"/illustrations/404.svg"} className='w-full max-w-[500px]' />
            <p
              className='w-full flex flex-row justify-center font-semibold text-md'
            >
              404 - "this page does not exist."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

