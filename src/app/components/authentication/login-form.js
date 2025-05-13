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



export default function LoginForm() {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();


  const formSchema = z.object({
    email: z.string().email({
      "message": "The Email provided is invalid!"
    }).max(300, {"message": "the maximum email length is 300 characters"}),

    password: z.string().min(6, {"message": "The minimum password length is 6 characters"}).max(256, {"message": "The maximum password length is 256 characters"})
  });


  // work on login form etc...
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });


  const signIn = async (creds) => {
    setLoading(true);
    //
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: creds.email,
    //   password: creds.password
    // });
    //
    // fetch from api instead of supabase
  
    // if(error)
    // {
    //   form.setError("password", {"message": error.message})
    // }
    //
    // else{
    //   toast({
    //     title: "Success",
    //     description: "Successfully logged in!"
    //   });
    //

      window.location.reload();

    // }

    setLoading(false);
  }


  const LoadingSkeleton = () => {
    return (
      <div className="w-full h-full flex flex-col justifty-center gap-5 p-5">

        <Skeleton className="h-12 w-[80%] rounded-md place-self-center" />

        <Skeleton className="h-12 w-[80%] rounded-md place-self-center" />

          <Skeleton className="h-10 w-[80%] rounded-md place-self-center" />
      </div>
    )
  }


  if(loading)
  {
    return <LoadingSkeleton />
  }


 return (
    <Form {...form} className="h-full w-full p-5 flex flex-col">
      <form onSubmit={form.handleSubmit(signIn)} className="flex flex-col py-10">

        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
              <FormItem className="w-fit place-self-center">
                <FormControl>
                  <Input placeholder="Email" value={email} type="email" className="w-full min-w-[400px] place-self-start rounded-lg p-5" {...field} />
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
                  <Input placeholder="Password" value={password} type="password" className="min-w-[400px] w-full place-self-start rounded-lg p-5" {...field} />
                </FormControl>

                 <div className="flex flex-row justifty-center p-2  max-w-fit place-self-start">
                  <FormMessage className="text-red-500" />
                </div>
              </FormItem>


          )}
        />


        <Button className="max-w-[400px] w-full place-self-center top-5 relative">
          Login
        </Button>
      </form>
  </Form>
 )
}





