'use client'
import { Button } from "@/components/ui/button";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { accountCacheGet, API_URL, errorToReadable, toAuthHeaders } from "../utils/api";



export const submitReport = async ({object_type, object_id, object_uuid, description, reporterUsername, priority, disturbance}) => {
  return await fetch(API_URL+`report`, {
    method: "POST",
    headers: toAuthHeaders({"Content-Type": "application/json"}),
    body: JSON.stringify({
      "object_id": object_id,
      "object_type": object_type,
      "object_uuid": object_uuid,
      "description": description,
      "priority": priority,
      "reporter": reporterUsername,
      "disturbance": disturbance
    })
  });

}




export const WriteUpReportDialog = ({writeUpId, show, setShow}) => {


  const { toast } = useToast();

  const [priority, setPriority] = useState([0]);
  const [disturbance, setDisturbance] = useState([0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);



  const handleSubmit = async () => {

    setLoading(true);

    const account = accountCacheGet();

    if(!account)
    {
      toast({
        title: "Failed to report!",
        description: "You are not authenticated."
      });
      setLoading(false);
      return;
    }


    const res = await submitReport({
      object_type: 'writeup',
      object_id: writeUpId,
      description: description,
      disturbance: disturbance[0],
      priority: priority[0],
      reporterUsername: account.username
    });

    if(!res.ok)
    {
      toast({
        title: "Failed to report!",
        description: errorToReadable(await res.json())
      });
    }
    else{
      toast({
        title: "Thanks for improving our platform!"
      });
      setShow(false);
    }

    setLoading(false);
  }


  return (
    <Drawer defaultOpen={false} open={show} onOpenChange={(p)=>setShow(p)}>
      <DrawerContent className="h-[50svh]">
        <DrawerHeader>
          <DrawerTitle>
            Report
          </DrawerTitle>

          <DrawerDescription>
            Please provide accurate information.
          </DrawerDescription>
        </DrawerHeader>

        <div className="w-full h-full flex flex-col justify-center gap-10">

          <div className="w-full flex flex-row justify-center gap-2">
            <Label className="text-muted-foreground">
              Priority:
            </Label>
            <Slider 
              defaultValue={priority} 
              max={100} 
              step={1} 
              onValueChange={(p)=>setPriority(p)}
              className="w-[80%] max-w-[60svw] place-self-center"
            />
          </div>


          <div className="w-full flex flex-row justify-center gap-2">
            <Label className="text-muted-foreground">
              Disturbance:
            </Label>
            <Slider 
              defaultValue={disturbance} 
              max={100} 
              step={1} 
              onValueChange={(d)=>setDisturbance(d)}
              className="w-[80%] max-w-[60svw] place-self-center"
            />
          </div>


          <div className="w-full flex flex-row justify-center gap-2">
            <div className="h-full flex flex-col justify-center">
              <Label className="text-muted-foreground">
                Description:
              </Label>
            </div>
            <Textarea onChange={(e)=>setDescription(e.target.value)} placeholder="Describe what happened..." className="w-[80%] place-self-center max-w-[60svw]" />
          </div>
        </div>

        <DrawerFooter className="w-full flex flex-row justify-center">
          <Button disabled={!description || loading || !disturbance[0] || !priority[0]} className="w-[80%] max-w-[600px]" variant="outline" onClick={()=>handleSubmit()}>
            {loading && <Loader2 className="animate-spin" />}
            submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}


