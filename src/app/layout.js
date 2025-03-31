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

  weight: "500"
});



export default function RootLayout({ children }) {

  return (

      <html 
      lang="en"
      className={`${AbrilFatFace.variable} ${RobotoFont.variable}`}
    >
        <head>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
  <link rel="manifest" href="/site.webmanifest"/>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/styles/github-dark.min.css"/>


      <meta name="description" content="Voidback - Create communities and contribute to machine learning models all from your browser." />
      <meta name="keywords" content="Voidback, Rooms, In Browser AI, In Browser Machine Learning, Models, ML, AI, Communities, Discussions " />


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
