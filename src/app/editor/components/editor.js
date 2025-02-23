'use client'
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from '@tiptap/extension-placeholder';
import "./editor.css";
import Mention from "@tiptap/extension-mention";
import hashtagSuggestions from "./hashtagSuggestions";
import mentionSuggestions from "./mentionSuggestions";
import symbolSuggestions from "./symbolSuggestions";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import FontFamily from "@tiptap/extension-font-family";






export const Editor = ({setContent, setAttributes, setText}) => {


  const extractMentions = (data) => {
    const res = (data.content || []).flatMap(extractMentions)

    if(data.type === "mentionSuggestions") {
      res.push(data.attrs.id);
    }

    return res;
  }


  const extractHashtags = (data) => {
    const res = (data.content || []).flatMap(extractHashtags)

    if(data.type === "hashtagSuggestions") {
      res.push(data.attrs.id);
    }

    return res;
  }


  const extractSymbols = (data) => {
    const res = (data.content || []).flatMap(extractSymbols)

    if(data.type === "symbolSuggestions") {
      res.push(data.attrs.id);
    }

    return res;
  }


  const getAttributes = (content) => {

    let m = extractMentions(content);
    let h = extractHashtags(content);
    let s = extractSymbols(content);


    return {
      hashtags: h,
      mentions: m,
      symbols: s
    };
  }



  const editor = useEditor({

    immediatelyRender: false,

    extensions: [

      StarterKit,

      FontFamily.configure({
        types: ['textStyle'],
      }),

      CharacterCount.configure({
        limit: 3000
      }),


      Placeholder.configure({
        placeholder: "thoughts...",
      }),

      Link.configure({
        linkOnPaste: true,
        openOnClick: true,
        autolink: true,
        defaultProtocols: 'https',
        protocols: ['http', "https"],
        HTMLAttributes: {
          class: "text-primary-400"
        },
        optionalSlashes: true
      }),

      Mention.extend({name: "hashtagSuggestions"}).configure({
        renderHTML({ options, node }) {
          return ['a', {
            class: "font-semibold text-primary-500",
            href: `/hashtag/${node.attrs.id.hashtag}`
          }, '#'+node.attrs.id.hashtag]
        },

        suggestion: hashtagSuggestions,
      }),


      Mention.extend({name: "mentionSuggestions"}).configure({
        renderHTML({ options, node }) {
          return ['a', {
            class: "font-semibold text-primary-400",
            href: `/view/account/${node.attrs.id.username}`
          }, '@'+node.attrs.id.username]
        },

        suggestion: mentionSuggestions
      }),


      Mention.extend({name: "symbolSuggestions"}).configure({
        renderHTML({ options, node }) {
          return ['a', {
            class: "font-semibold text-emerald-500",
            href: `/symbol/${node.attrs.id.symbol}`
          }, '$'+node.attrs.id.symbol]
        },

        suggestion: symbolSuggestions
      }),
    ],

    editorProps: {
      attributes: {
        class: "focus:outline-none w-full h-[30vh] max-h-[30vh] p-3 border-1 rounded-lg overflow-auto",
        'aria-label': 'editor-label', 
      },
    },


    onUpdate: ({ editor }) => {
      setContent(editor.getJSON());
      setAttributes(getAttributes(editor.getJSON()))
      setText(editor.state.doc.textContent);
    }
    
  })



  return (
    <EditorContent 
      editor={editor} 
      className={"w-full p-4 overflow-auto"}
    />
  )
}



export const ReadonlyEditor = ({content}) => {


  const editor = useEditor({

    immediatelyRender: false,

    extensions: [

      StarterKit,

      Placeholder.configure({
        placeholder: "thoughts...",
      }),


      FontFamily.configure({
        types: ['textStyle'],
      }),


      Link.configure({
        linkOnPaste: true,
        openOnClick: true,
        autolink: true,
        defaultProtocols: 'https',
        protocols: ['http', "https"],
        HTMLAttributes: {
          class: "text-primary-400"
        },
        optionalSlashes: true
      }),



      Mention.extend({name: "hashtagSuggestions"}).configure({
        renderHTML({ options, node }) {
          return ['a', {
            class: "font-semibold text-primary-500",
            href: `/hashtag/${node.attrs.id.hashtag}`
          }, '#'+node.attrs.id.hashtag]
        },

        suggestion: hashtagSuggestions,
      }),


      Mention.extend({name: "mentionSuggestions"}).configure({
        renderHTML({ options, node }) {
          return ['a', {
            class: "font-semibold text-primary-400",
            href: `/view/account/${node.attrs.id.username}`
          }, '@'+node.attrs.id.username]
        },

        suggestion: mentionSuggestions
      }),


      Mention.extend({name: "symbolSuggestions"}).configure({
        renderHTML({ options, node }) {
          return ['a', {
            class: "font-semibold text-emerald-500",
            href: `/symbol/${node.attrs.id.symbol}`
          }, '$'+node.attrs.id.symbol]
        },

        suggestion: symbolSuggestions
      }),


    ],


    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
      editable: ()=> false
    },


    content: content

  });


  return (
    <EditorContent 
      editor={editor} 
      className={"w-[90%] place-self-center"}
      readOnly
      label="editor"
      style={{textAlign: "center", fontWeight: 500}}
    />
  )
}






export default Editor;
