"use client"
import "./globals.css";
import dynamic from 'next/dynamic'
import HydrationZustand from "./globalComponents/HydrationZustand";


const DynamicProviders = dynamic(
  () => import('./providers/index'),
  { ssr: false }
)
 



export default function RootLayout({ children }) {

  return (
    <HydrationZustand>
      <html lang="en">
        <head>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
  <link rel="manifest" href="/site.webmanifest"/>

  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Libre+Franklin:ital,wght@0,100..900;1,100..900&family=Roboto+Slab:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>


  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>

  <link href="https://fonts.googleapis.com/css2?family=Gupter:wght@400;500;700&display=swap" rel="stylesheet"/>

        </head>

        <body>
          <DynamicProviders>
            {children}
          </DynamicProviders>
        </body>
      </html>
    </HydrationZustand>
  );
}
