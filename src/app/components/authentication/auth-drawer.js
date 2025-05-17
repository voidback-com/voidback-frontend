'use client'
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTitle, DrawerTrigger, DrawerContent, DrawerClose, DrawerFooter, DrawerHeader, DrawerDescription } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader } from "@/components/ui/dialog";
import { LogIn } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import SignupForm from "./signup-form";
import LoginForm from "./login-form";
import { useMediaQuery } from "react-responsive";
import { DialogDescription } from "@radix-ui/react-dialog";





const RenderSelectedAuthTab = ({selectedAuthTab}) => {
  switch(selectedAuthTab)
  {
    case "signup":
      return <SignupForm />;

    default:
      return <LoginForm />;
  }
}




const AuthenticationTabs = ({setSelectedAuthTab, selectedAuthTab}) => {


  return (
   <ToggleGroup
      type="single"
      className="border-[0px] p-0 flex flex-row justify-between rounded-lg w-fit h-fit"
      onValueChange={setSelectedAuthTab}
      value={setSelectedAuthTab}
    >
      <ToggleGroupItem className={`text-sm font-semibold p-2 rounded-lg ${selectedAuthTab==="signup" && "bg-neutral-200 dark:bg-neutral-800"}`} aria-label="signup" value="signup">
        <p>Signup</p>
      </ToggleGroupItem>

      <ToggleGroupItem className={`text-sm font-semibold p-2 rounded-lg ${selectedAuthTab==="login" && "bg-neutral-200 dark:bg-neutral-800"}`} aria-label="login" value="login">
        <p>Login</p>
      </ToggleGroupItem>


    </ToggleGroup>
  )
}




export const AuthenticationDrawer = ({isOpen, setIsOpen}) => {

  const [selectedAuthTab, setSelectedAuthTab] = useState("signup");


  const isDesktop = useMediaQuery({query: "(min-width: 768px)"});


  if(isDesktop) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild className="p-6">
            <Button variant="ghost" size="icon">
              <LogIn />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Authenticate</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Simple & Quick</DialogDescription>
            </DialogHeader>


            <div className="w-full h-full flex flex-col">

              {/* Authentication Tabs */}
              <div className="w-full flex flex-row justify-center">
                <AuthenticationTabs setSelectedAuthTab={setSelectedAuthTab} selectedAuthTab={selectedAuthTab} />
              </div>

              {/* Rendering Selected Authentication Tab */}
              <RenderSelectedAuthTab selectedAuthTab={selectedAuthTab} />

            </div>

          </DialogContent>
      </Dialog>
    )
  }

 return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild className="p-6">
        <Button variant="ghost" size="icon">
          <LogIn />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Authenticate</DrawerTitle>
          <DrawerDescription>Simple & Quick</DrawerDescription>
        </DrawerHeader>

            <div className="w-full h-full flex flex-col">

              {/* Authentication Tabs */}
              <div className="w-full flex flex-row justify-center">
                <AuthenticationTabs setSelectedAuthTab={setSelectedAuthTab} selectedAuthTab={selectedAuthTab} />
              </div>

              {/* Rendering Selected Authentication Tab */}
              <RenderSelectedAuthTab selectedAuthTab={selectedAuthTab} />

            </div>


        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="max-w-[400px] w-full place-self-center">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>

      </DrawerContent>
    </Drawer>
  )
  
}




