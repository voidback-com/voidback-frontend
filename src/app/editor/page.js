'use client'
import {
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, ListVideo, Loader2, LucideTag } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountCacheGet, API_URL, errorToReadable, toAuthHeaders } from "../utils/api";
import { useToast } from "@/hooks/use-toast";
import { getImageClass } from "../components/helpers/sfwImageVerifier";
import { NavBack } from "../components/helpers/NavBack";
import ResizeObserver from "resize-observer-polyfill";
import { Tags } from "../components/writeUp/Tags";
import { fetchUserSeries } from "../components/helpers/Profile";
import { Select, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";


global.ResizeObserver = ResizeObserver;



const PublishForm = ({ form, submit, loading, setThumbnail }) => {

  return (
    <Form {...form} className="h-full w-full p-5 flex flex-col">
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col py-10">

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
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
          render={({ field }) => (
            <FormItem className="w-fit place-self-center">

              <FormLabel>Thumbnail (not required)</FormLabel>
              <FormControl>
                <Input placeholder="thumbnail" type="file" className="w-full min-w-[400px] place-self-start rounded-lg" accept="image/png, image/gif, image/jpeg" {...field} onChange={(e) => setThumbnail(e.target.files[0])} />
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
          render={({ field }) => (
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
  const [thumbnailSafe, setThumbnailSafe] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState("");


  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");

  const [newSeries, setNewSeries] = useState(null); // the series the user is trying to create
  const [series, setSeries] = useState([]); // all the series the user created


  const [isOpen, setIsOpen] = useState(false);


  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });


  const handleNewTag = () => {
    const t = { "tag": tag };

    if (tags.length)
      setTags(p => p.filter((t) => t.tag !== tag));

    setTags(p => [...p, t]);

    setTag("");
  }


  const handleDelete = (tagText) => {
    setTags(p => p.filter((t) => t.tag !== tagText));
  }


  const theme = useTheme();

  useEffect(() => {
    if (theme.theme) {
      document.documentElement.setAttribute("data-color-mode", theme.theme);
    }
  }, [theme])


  const formSchema = z.object({
    title: z.string().min(5, { "message": "the minimum title length is 5 characters" }).max(100, { "message": "the maximum title length is 100 characters" }),

    description: z.string().max(310, { "message": "The maximum short description length is 310 characters." }),
    thumbnail: z.any()
  });


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });



  const { toast } = useToast();



  const handleSubmitWriteUp = async (writeup) => {

    if (loading) return;

    setLoading(true);


    const data = {
      title: writeup.title,
      description: writeup?.description ? writeup.description : "",
      content: content,
      tags: tags, // later on support for tags will come
      series: selectedSeries
    };


    const form_writeup = new FormData();


    form_writeup.append("writeUp", JSON.stringify(data));


    if (thumbnail && thumbnailSafe) {
      form_writeup.append("thumbnail", thumbnail);
    }

    else if (thumbnail && !thumbnailSafe) {
      setLoading(false);
      return;
    }


    const response = await fetch(API_URL + `writeup`, {
      method: "POST",
      headers: toAuthHeaders({}),
      body: form_writeup
    })


    const resData = await response.json();

    if (!response.ok) {
      toast({
        title: "Error publishing!",
        description: resData?.error ? resData.error : errorToReadable(resData),
      })
    }

    else {
      toast({
        title: "Success",
        description: "Write-up published successfully!"
      });

    }

    setLoading(false);
  }


  useEffect(() => {

    if (thumbnail) {
      setLoading(true);

      const r = new FileReader();

      r.readAsDataURL(thumbnail);

      r.onload = async (e) => {

        const img_dat = e.target.result;
        const img_cls = await getImageClass(img_dat);

        if (img_cls === "sfw") {
          setThumbnailSafe(true);
        }

        else {
          setThumbnailSafe(false);
          form.setError("thumbnail", { "message": "Thumbnail was classified as not safe for work." });
        }

        setLoading(false);
      }
    }


  }, [thumbnail])


  const handleNewSeries = async () => {
    const response = await fetch(API_URL + "newSeries", {
      method: "POST",
      headers: toAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name: newSeries })
    });


    if (response.ok) {
      setSelectedSeries(newSeries);

      toast({
        title: `Created new series "${newSeries}"`
      });

      setNewSeries(null);

      fetchSeries();
    }

    else {
      toast({
        title: "Failed to create new series!",
        description: errorToReadable(await response.json())
      });

    }
  }



  const fetchSeries = async () => {
    const acc = accountCacheGet();

    if (!acc)
      return null;

    const data = await fetchUserSeries(acc.username);

    if (data) {
      setSeries(data);
    }
  }


  useEffect(() => {
    if (!series.length) {
      fetchSeries();
    }
  }, [!series.length])



  console.log(series);


  return (
    <div
      className="w-full h-full max-h-[100vh] flex flex-col justify-center"
    >

      <div className="w-full h-[10vh] relative flex flex-row bg-background justify-between pl-5 pr-5">

        {/* Navback */}
        <div className="h-full flex flex-col justify-center">
          <NavBack />
        </div>


        <div className="w-full h-full flex flex-row justify-end pr-5 gap-5">

          {/* Series drawer */}
          <div className="h-full flex flex-col justify-center">

            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                >
                  Series <ListVideo />
                </Button>

              </DrawerTrigger>

              <DrawerContent className="w-full h-full">
                <DrawerHeader>
                  <DrawerTitle>
                    Series
                  </DrawerTitle>

                  <DrawerDescription>
                    Associate your write up with a series
                  </DrawerDescription>
                </DrawerHeader>


                <div className="self-center p-0 h-full w-full flex flex-col gap-20 p-5 min-w-[330px]">

                  {/* Show selected series below */}



                  {/* create series */}
                  <div className="w-full sm:max-w-[350px] lg:max-w-[500px] h-fit self-center flex flex-col">

                    <div
                      className="h-full flex flex-row w-full pb-4"
                    >
                      <label htmlFor="createSeries" className="text-muted-foreground text-sm">Create Series</label>
                    </div>


                    <div
                      className="w-full flex flex-row justify-center gap-2"
                    >

                      <Input id="createSeries" onChange={(e) => setNewSeries(e.target.value)} placeholder="Series Name" />
                      <Button
                        variant="outline"
                        onClick={handleNewSeries}
                        disabled={!newSeries}
                      >
                        create
                      </Button>
                    </div>
                  </div>


                  {/*select series*/}
                  <div className="w-full sm:max-w-[350px] lg:max-w-[500px] h-fit self-center flex flex-col">

                    <div
                      className="h-full flex flex-col justify-center pb-4"
                    >
                      <label htmlFor="series" className="text-muted-foreground text-sm">Select a series</label>
                    </div>


                    <Select id="series" onValueChange={(v) => setSelectedSeries(v)} value={selectedSeries}>

                      <SelectTrigger>
                        <SelectValue placeholder="select a series" />
                      </SelectTrigger>

                      <SelectContent>

                        <SelectGroup>
                          <SelectLabel>series</SelectLabel>
                          {
                            series.map((s) => {
                              return <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                            })
                          }
                        </SelectGroup>

                      </SelectContent>

                    </Select>

                  </div>


                </div>

              </DrawerContent>

            </Drawer>
          </div>



          {/* Tags Drawer */}
          <div className="h-full flex flex-col justify-center">
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  disabled={!content.length}
                  variant="outline"
                >
                  add tags<LucideTag />
                </Button>
              </DrawerTrigger>

              <DrawerContent className="h-full w-full">
                <DrawerHeader>
                  <DrawerTitle>
                    Tags
                  </DrawerTitle>

                  <DrawerDescription>
                    Tags are essentially cateogries that you're writ-up falls under.
                  </DrawerDescription>
                </DrawerHeader>


                <div className="self-center flex flex-col gap-5 p-5 min-w-[330px]">

                  <div className="w-full flex flex-col self-center gap-5">
                    <Label>
                      Tag (Hit enter)
                    </Label>

                    {tags.length < 4 ?
                      <Input
                        className="max-w-[350px]"
                        placeholder="Tag..."
                        maxLength={30}
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Return") {
                            handleNewTag();
                          }
                        }}
                      />
                      : null
                    }
                  </div>


                  <Tags tags={tags} handleDelete={handleDelete} readonly={false} />
                </div>



              </DrawerContent>

            </Drawer>
          </div>
        </div>



        {/* Publish Drawer */}
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
          onChange={(value, viewUpdate) => setContent(value)}
        />
      </div>
    </div>

  )
}



export default VoidBackEditor;

