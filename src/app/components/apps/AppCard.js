'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"




export const AppCard = ({app}) => {


  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>
          {app.name}
        </CardTitle>
        <CardDescription>
          {app.description}
        </CardDescription>

        <img
          className="w-[150px]"
          alt={app.name+"-logo"}
          src={app.thumbnail.thumbnail}
        />


      </CardHeader>

      <CardContent>
      </CardContent>

      <CardFooter>
      </CardFooter>
    </Card>
  )
}
