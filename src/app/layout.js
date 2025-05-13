"use client"
import "./globals.css";
import { Roboto, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";


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

    <meta name="viewport" content="width=device-width, minimum-scale=1" />

      <meta name="description" content={`Voidback: a platform by nerds for nerds`} />

      <meta name="keywords" content="Voidback, A.I, AI, AI Apps, ML Models, Inferencing, Pretrained Models, Ethical Hacking, Security, " />


  </head>

        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>

          <Toaster />
        </body>

      </html>
  );
}
