'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL, errorToReadable } from "@/app/utils/api";



export default function SignupForm() {

  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);


  const { toast } = useToast();


  const formSchema = z.object({

    fullName: z.string().min(2, "The minimum name length is 2 characters."),

    username: z.string().min(3, "The minimum username length is 3 character"),

    email: z.string().email({
      "message": "The Email provided is invalid!"
    }).max(300, {"message": "the maximum email length is 300 characters"}),

    password: z.string().min(6, {"message": "The minimum password length is 6 characters"}).max(256, {"message": "The maximum password length is 256 characters"}),


  });


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: ""
    },
  });


  const signUp = async (creds) => {

    setLoading(true);

    const credentials = {
      "full_name": creds.fullName,
      "username": creds.username,
      "email": creds.email,
      "password": creds.password
    };


    const response = await fetch(API_URL+"signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(credentials)
    })


    const data = await response.json();


    if(!response.ok)
    {
      if(data?.email)
      {
        form.setError("email", {"message": data.email});
      }

      if(data?.full_name)
      {
        form.setError("fullName", {"message": data.full_name});
      }


      if(data?.username)
      {
        form.setError("username", {"message": data.username});
      }


      if(data?.password)
      {
        form.setError("password", {"message": data.password});
      }
    }


    else{
      toast({
        title: "Success",
        description: "Successfully signed up!"
      });


    }

    setLoading(false);
  }


  const LoadingSkeleton = () => {
    return (
      <div className="w-full h-full flex flex-col justifty-center gap-5 p-5">

        <Skeleton className="h-12 w-[80%] rounded-md place-self-center" />
        <Skeleton className="h-12 w-[80%] rounded-md place-self-center" />
        <Skeleton className="h-12 w-[80%] rounded-md place-self-center" />


          <Skeleton className="h-10 w-[80%] rounded-md place-self-center" />

          <Skeleton className="h-10 w-[80%] rounded-md place-self-center" />
      </div>
    )
  }

  if(loading)
  {
    return <LoadingSkeleton />
  }


 return (
  <Form {...form} className="h-full w-full p-5 flex flex-col gap-5">
      <form onSubmit={form.handleSubmit(signUp)} className="flex flex-col py-10">


        <FormField
          control={form.control}
          name="fullName"
          render={({field}) => (
              <FormItem className="w-fit place-self-center">
                <FormControl>
                  <Input placeholder="Full Name" type="text" className="w-full min-w-[400px] place-self-start rounded-lg p-5" {...field} />
                </FormControl>

                 <div className="flex flex-row justifty-center p-2  max-w-fit place-self-start">
                  <FormMessage className="text-red-500" />
                </div>
              </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
              <FormItem className="w-fit place-self-center">
                <FormControl>
                  <Input placeholder="Username" type="text" className="w-full min-w-[400px] place-self-start rounded-lg p-5" {...field} />
                </FormControl>

                 <div className="flex flex-row justifty-center p-2  max-w-fit place-self-start">
                  <FormMessage className="text-red-500" />
                </div>
              </FormItem>
          )}
        />



        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
              <FormItem className="w-fit place-self-center">
                <FormControl>
                  <Input placeholder="Email" type="email" className="w-full min-w-[400px] place-self-start rounded-lg p-5" {...field} />
                </FormControl>

                 <div className="flex flex-row justifty-center p-2  max-w-fit place-self-start">
                  <FormMessage className="text-red-500" />
                </div>
              </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
              <FormItem className="w-fit place-self-center">
                <FormControl>
                  <Input placeholder="Password" type="password" className="w-full min-w-[400px] place-self-start rounded-lg p-5" {...field} />
                </FormControl>

                 <div className="flex flex-row justifty-center p-2  max-w-fit place-self-start">
                  <FormMessage className="text-red-500" />
                </div>
              </FormItem>
          )}
        />



        <Button className="max-w-[400px] w-full place-self-center">
          Signup
        </Button>
      </form>
  </Form>
 )
}




