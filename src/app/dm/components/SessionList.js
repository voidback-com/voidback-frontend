import { Spinner, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import { SessionCard } from "./SessionCard";
import { SessionHeader } from "./SessionHeader";



export const SessionsList = ({messages, setMessages, selected, setSelected, loading}) => {

  const [currentSelection, setCurrentSelection] = useState(setSelected ? selected : null);

  const renderMessages = () => {
    return messages.map((message)=> {
      return (
        <Tab 
           key={JSON.stringify(message)}
           className="h-[12vh] w-full"
           aria-label={message.id}
           title={<SessionCard message={message} />}
        />
      )
    })
  }



  return (
    <div className="w-[50%] min-w-[500px] h-full flex flex-col overflow-y-scroll border-1 rounded-lg">

      <SessionHeader />
      
      <Tabs
        className="h-full flex flex-col justify-between overflow-y-scroll"
        variant="light"
        aria-label="tabs-nav"
        isVertical
        size="lg"
        fullWidth
        selectedKey={currentSelection}
        defaultSelectedKey={currentSelection}
        onSelectionChange={(e)=> {
          if(e==="none")
            return

          setSelected(e);
          setCurrentSelection(e);
        }}
      >
        {
          loading
            ?
            <Tab key={"none"}>
          <Spinner />
          </Tab>
          :
            null
        }
        <Tab key={"none"} style={{display: "none"}}>
        </Tab>
        {renderMessages()}
      </Tabs>
    </div>
  )
}
