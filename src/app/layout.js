"use client"
import "./globals.css";
import dynamic from 'next/dynamic'
import HydrationZustand from "./globalComponents/HydrationZustand";
import { Roboto, Playfair_Display } from 'next/font/google';


const DynamicProviders = dynamic(
  () => import('./providers/index'),
  { ssr: false }
)



export const PlayFair = Playfair_Display({
  subsets: ['latin'],
  display: "swap",

  variable: "--font-playfair",
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
      className={`${PlayFair.variable} ${RobotoFont.variable}`}
      suppressHydrationWarning
    >
        <head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
          <link rel="manifest" href="/site.webmanifest"/>

        <link rel="stylesheet" href="/github-dark.min.css"/>

        <title itemProp="title" itemScope>Voidback</title>

    <meta name="viewport" content="width=device-width, user-scalable=no" />

      <meta name="description" content={`Voidback: Read Limitlessly. Write Freely. Rise Together..`} />

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
