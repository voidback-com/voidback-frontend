'use client'
import { NavigationBar } from "@/app/components/Navigation"
import { useEffect, useState } from "react"




export default function Page() {


  return (
    <div className="w-full h-[100svh]">

      <NavigationBar selected="settings" feed={
        <div className="w-full h-[100svh] p-10 flex flex-col overflow-y-scroll gap-10">
          <p className="font-black text-5xl">
            Voidback.
          </p>

            <div className="">
              <div class="max-w-4xl mx-auto px-4 py-8">
                <p class="mb-4 text-lg font-roboto leading-relaxed">
                  Welcome to Voidback – the digital haven crafted exclusively for developers, computer science enthusiasts, and tech "nerds" of all stripes! We believe in the power of shared knowledge and the beauty of collaborative innovation, and that's precisely what Voidback is built to foster.
                </p>
                <p class="mb-4 text-lg leading-relaxed font-roboto">
                  Our mission is simple: to provide a dedicated platform where you can effortlessly share your passions, document your projects (especially open-source endeavors!), and delve into the fascinating world of computer science topics. Whether you're building the next big thing, exploring a niche programming language, or simply want to articulate your understanding of complex algorithms, Voidback is your canvas.
                </p>
                <p class="mb-4 text-lg leading-relaxed font-roboto">
                  We offer a familiar and intuitive markdown editor. This powerful tool, sourced from <a href="https://uiwjs.github.io/react-markdown-editor" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">https://uiwjs.github.io/react-markdown-editor</a>, allows you to focus on conveying your ideas clearly and concisely, knowing that your write-ups will be beautifully presented in the format you already love. We extend our sincere gratitude to the author(s) of `react-markdown-editor` for their excellent work. All content on Voidback is rendered in markdown, ensuring a consistent and developer-friendly experience.
                </p>
                <p class="mb-4 text-lg leading-relaxed font-roboto">
                  More than just a publishing platform, Voidback aims to cultivate a vibrant community. We envision a space where tech folks can connect, learn from each other, and celebrate the incredible work being done in the world of open source and beyond. Join us in building a rich repository of knowledge, fostering insightful discussions, and empowering the next generation of innovators.
                </p>
                <p class="mb-4 text-lg leading-relaxed font-roboto">
                  Come share your journey, your insights, and your code with the Voidback community. Let's build, learn, and grow together!
                </p>
              </div>


          </div>
        </div>
      } />
    </div>
  )
}
