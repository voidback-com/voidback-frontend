'use client'
import { 
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_URL, errorToReadable, toAuthHeaders } from "../utils/api";
import { useToast } from "@/hooks/use-toast";
import { getImageClass } from "../components/helpers/sfwImageVerifier";



const PublishForm = ({form, submit, loading, setThumbnail}) => {

  return (
    <Form {...form} className="h-full w-full p-5 flex flex-col">
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col py-10">

        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
              <FormItem className="w-fit place-self-center">

                <FormLabel>Title (required)</FormLabel>

                <FormControl>
                  <Input placeholder="title" type="text" className="w-full min-w-[400px] place-self-start rounded-lg p-5" {...field} />
                </FormControl>

                 <div className="flex flex-row justifty-center p-2  max-w-fit place-self-start">
                  <FormMessage className="text-red-500" />
                </div>
              </FormItem>

          )}
        />


        <FormField
          control={form.control}
          name="thumbnail"
          render={({field}) => (
              <FormItem className="w-fit place-self-center">

                <FormLabel>Thumbnail (not required)</FormLabel>
                <FormControl>
                  <Input placeholder="thumbnail" type="file" className="w-full min-w-[400px] place-self-start rounded-lg" accept="image/png, image/gif, image/jpeg" {...field} onChange={(e)=>setThumbnail(e.target.files[0])} />
                </FormControl>

                 <div className="flex flex-row justifty-center p-2  max-w-fit place-self-start">
                  <FormMessage className="text-red-500" />
                </div>
              </FormItem>

          )}
        />



        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
              <FormItem className="w-fit place-self-center">
                <FormLabel>Description (not required)</FormLabel>
                <FormControl>
                  <Textarea placeholder="description (not required)" type="text" className="min-w-[400px] w-full place-self-start rounded-lg p-5 max-h-[400px] min-h-[200px]" {...field} />
                </FormControl>

                 <div className="flex flex-row justifty-center p-2  max-w-fit place-self-start">
                  <FormMessage className="text-red-500" />
                </div>
              </FormItem>


          )}
        />


        <Button className="max-w-[400px] w-full place-self-center top-5 relative">
          {loading && <Loader2 className="animate-spin" />}
          publish
        </Button>
      </form>
  </Form>
  )
}


const VoidBackEditor = () => {


  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(" ");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);


  const [isOpen, setIsOpen] = useState(false);


  const isDesktop = useMediaQuery({query: "(min-width: 768px)"});

  const editorRef = useRef();

  const theme = useTheme();

  useEffect(()=> {
    if(theme.theme)
    {
      document.documentElement.setAttribute("data-color-mode", theme.theme);
    }
  }, [theme])


  const formSchema = z.object({
    title: z.string().min(5, {"message": "the minimum title length is 5 characters"}).max(100, {"message": "the maximum title length is 100 characters"}),

    description: z.string().max(310, {"message": "The maximum short description length is 310 characters."}),
    thumbnail: z.any()
  });


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });



  const toast = useToast();



  const verifyImage = async () => {
    if(thumbnail)
    {
      const r = new FileReader();

      r.readAsDataURL(thumbnail);

      r.onload = async (e) => {

        const img_dat = e.target.result;
        const img_cls = await getImageClass(img_dat);

        if(img_cls==="sfw")
        {
          // nothing
        }
        else
        {
          setLoading(false);
          form.setError("thumbnail", {"message": "Thumbnail was classified as not safe for work."});
        }
      }

    }

  }

  const handleSubmitWriteUp = async (writeup) => {


    const data = {
      title: writeup.title,
      description: writeup?.description ? writeup.description : "",
      content: content,
      tags: [], // later on support for tags will come
      series: null // later on support for series will come
    };



    const form_writeup = new FormData();


    form_writeup.append("writeUp", JSON.stringify(data));

    setLoading(true);

    if(thumbnail)
    {
      await verifyImage();
      if(loading)
        form_writeup.append("thumbnail", thumbnail);
    }

    if(!loading)
      return;


    const response = await fetch(API_URL+`writeup`, {
      method: "POST",
      headers: toAuthHeaders({}),
      body: form_writeup
    })

    const resData = await response.json();

    if(!response.ok){
      form.setError("description", {"message": resData?.error ? resData.error : errorToReadable(resData)});
      setLoading(false);
    }

    else{
      toast.toast({
        title: "Success",
        description: "Write-up published successfully!"
      });

      setLoading(false);
    }

  }


  return (
    <div
      className="w-full h-full max-h-[100vh] flex flex-col justify-center"
    >

      <div className="w-full h-[10vh] relative flex flex-row bg-background justify-between pl-5 pr-5">

        <div className="h-full flex flex-col justify-center">
          <Link href={"/"}>
            <ArrowLeft />
          </Link>
        </div>

        <div className="h-full flex flex-col justify-center">
          {
            !isDesktop

            ?

            <Drawer>
              <DrawerTrigger asChild>
                <Button 
                  disabled={!content.length}
                  variant="outline"
                >
                {loading && <Loader2 className="animate-spin" />}
                  publish
                </Button>
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>
                      Publish
                  </DrawerTitle>

                  <DrawerDescription>
                      Simple & Quick
                  </DrawerDescription>

                </DrawerHeader>

                <div
                  className="w-full h-full flex flex-col p-10 gap-10"
                >
                  <PublishForm loading={loading} form={form} setThumbnail={setThumbnail} submit={handleSubmitWriteUp} />
                </div>

              </DrawerContent>
            </Drawer>
          :

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                  {loading && <Loader2 className="animate-spin" />}
                    publish
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Publish</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">Simple & Quick</DialogDescription>
              </DialogHeader>


              <div className="w-full h-full flex flex-col">

                <div className="w-full flex flex-row justify-center">
                  <PublishForm loading={loading} form={form} setThumbnail={setThumbnail} submit={handleSubmitWriteUp} />
                </div>

              </div>

            </DialogContent>
          </Dialog>
   
          }
        </div>

      </div>

      <div className="w-full h-[90vh] overflow-y-scroll border rounded-md">

        <MarkdownEditor 
          className="h-full"
          value={content}
          color="black"
          onChange={(value,viewUpdate)=>setContent(value)}
        />
      </div>
    </div>

  )
}



export default VoidBackEditor;

