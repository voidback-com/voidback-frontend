'use client'
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/app/providers/AuthProvider";
import { 
  VStack,
  Spacer,
  HStack,
  Stack,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SkeletonText,
  Link,
  CloseButton,
  Text
} from "@chakra-ui/react";
import { Card, CardBody, CardFooter, CardHeader, Divider, Chip, Avatar } from "@nextui-org/react";




export const CommentCard = ({comment}) => {


  return (
    <HStack className="w-full flex flex-row justify-center">
      <Card
        variant={"unstyled"}
        backgroundColor={"default"}
        className="bg-background w-1/2 shadow-none border-1 min-w-[250px] max-w-[500px]"
      >
        <CardHeader
          className="w-full"
        >

          <HStack className="w-[85%] pb-5">
            <VStack>

              <Avatar name={comment.author.full_name[0]} src={comment.author.avatar} size="lg" />

            </VStack>

            <VStack>
              <Text
                className="text-md font-semibold text-title"
              >
                {comment.author.full_name}
              </Text>

              <Link href={`/view/account/${comment.author.username}`}>
                <Text
                  className="text-sm font-semibold text-gray-500"
                >
                  @{comment.author.username}
                </Text>
              </Link>


            </VStack>
          </HStack>
        </CardHeader>

        <CardBody>
          <Text
            className="font-roboto"
          >
            {comment.comment}
          </Text>
        </CardBody>

        <CardFooter>
        </CardFooter>
      </Card>
    </HStack>
  )
}



