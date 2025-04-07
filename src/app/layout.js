"use client"
import "./globals.css";
import dynamic from 'next/dynamic'
import HydrationZustand from "./globalComponents/HydrationZustand";
import { Abril_Fatface, Roboto } from 'next/font/google';


const DynamicProviders = dynamic(
  () => import('./providers/index'),
  { ssr: false }
)



export const AbrilFatFace = Abril_Fatface({
  subsets: ['latin'],
  display: "swap",

  variable: "--font-abril",
  weight: "400",
});



export const RobotoFont = Roboto({
  subsets: ['latin'],
  display: "swap",

  variable: "--font-roboto",

  weight: "400"
});



export default function RootLayout({ children }) {

  return (

      <html 
      lang="en"
      className={`${AbrilFatFace.variable} ${RobotoFont.variable}`}
      suppressHydrationWarning
    >
        <head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
          <link rel="manifest" href="/site.webmanifest"/>

        <link rel="stylesheet" href="/github-dark.min.css"/>

        <title>Voidback</title>


      <meta name="description" content={`Voidback - Discover Voidback, a platform built for readers and writers to create and share content. Write "write ups" (blog posts), organize them into categories, and create "series" to tell stories. Our goal is to be the go-to place for online reading, writing and learning.`} />

      <meta name="keywords" content="Voidback, Docs, Editor, Publish, Write Ups, Write, Read, News, Learning, Writing, Blog, Blogs, WriteUps, Communities, Discussions, Knowledge, E-Learning, Online Learning" />


  </head>

        <body>
          <HydrationZustand>
            <DynamicProviders>
              {children}
            </DynamicProviders>
          </HydrationZustand>

        </body>

      </html>
  );
}
