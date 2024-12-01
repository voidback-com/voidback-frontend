'use client'
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { forwardRef, useState, useEffect, useImperativeHandle, useContext } from "react";
import { UserCard } from "@/app/profile/components/components";
import { PluginKey } from "prosemirror-state";
import { API_URL } from "@/app/configs/api";



const MentionList = forwardRef((props, ref)=> {
  const [selectedIndex, setSelectedIndex] = useState(0);


  const selectItem = (index) => {
    const item = props.items[index]

    if(item) {
      props.command({ id: item })
    }
  }


  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length -1) % props.items.length)
  }


  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }


  const enterHandler = () => {
    selectItem(selectedIndex)
  }


  useEffect(() => setSelectedIndex(0), [props.items])


  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))


  return (
    <ul className="p-2 flex flex-col border-1 rounded-md bg-default-50">
      {props.items.length
        ? props.items.map((item, index) => (
          <li
            className="hover:bg-default-100 rounded-md p-1 font-semibold focus:bg-default-100"
            key={index}
            onClick={() => selectItem(index)}
          >
            <UserCard 
              username={item.username} 
              avatarUrl={item.avatar} 
              fullName={item.full_name}
            />
          </li>
        ))
        : 
        <li 
          className="hover:bg-default-100 rounded-md p-1 font-semibold focus:bg-default-100"
        >not found!</li>
      }
    </ul>
  )
})




const Items = async (query) => {


  const stringToLikeAnyOf = (txt) => {
    let t = txt.replace("@", "").split("");

    let res = []

    t.forEach((f)=> {
      res.push(`%${f}%`)
    })


    return res;
  }


  const mentionAutocomplete = async (text) => {

    const data = await fetch(API_URL+`account/search?username=${text}`, {
      method: "GET"
    });

    return data.json();

  }



  return mentionAutocomplete(query)
    .then((res)=>{
      if(res && res.length)
      {
        return res.filter((x)=>x.username.toLowerCase().indexOf(query.toLowerCase())!==-1);
      }
      else{
        return [];
      }
    })
}



export default {

  char: "@",

  decorationClass: "rounded-md p-1 font-semibold text-primary-500", 

  decorationTag: "span",

  pluginKey: new PluginKey("mentions"),


  items: async ({ query }) => await Items(query),

  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component?.ref.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },


}
