'use client'
import { EditorProvider, ReactNodeViewRenderer, useCurrentEditor, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import "./components/editor.css"
import { EditorContent } from "@tiptap/react";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import { PluginKey } from "prosemirror-state";
import FloatingMenu from "@tiptap/extension-floating-menu";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import FontSize from "tiptap-extension-font-size";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import codeBlockComponent from "./components/menu/codeBlockComponent";
import Youtube from "@tiptap/extension-youtube";
import Dropcursor from "@tiptap/extension-dropcursor";
import Blockquote from "@tiptap/extension-blockquote";
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import { createLowlight, all } from "lowlight";
import Link from "@tiptap/extension-link";
import Document from "@tiptap/extension-document";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Footnote, FootnoteReference, Footnotes } from "tiptap-footnotes";





const EditorReadOnly = ({content}) => {

  const lowlight = createLowlight(all)

  const editor = useEditor({
    editable: false,
    content: content,
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),

      TextStyle.configure({ types: [ListItem.name] }),

      StarterKit.configure({
        
        bulletList: {
          keepMarks: true,
        },

        document: false
      }),


      Document.extend({
        content: "block+ footnotes?",
      }),


      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', "center", 'right'],
        defaultAlignment: "left",
  }),

        Placeholder.configure({
          placeholder: "Content here...",
        }),

        Heading.configure({
          levels: [1,2,3,4,5,6],
        }),

        Paragraph,

        FontSize.configure({
        }),

        Image.configure({
          HTMLAttributes: {
            "class": "w-[90%] self-center"
          },

          allowBase64: true
        }),

        CodeBlock.configure({
          defaultLanguage: "plaintext",
          exitOnArrowDown: true,
          exitOnTripleEnter: false,
        }),

        CodeBlockLowlight.extend({
            addNodeView() {

              return ReactNodeViewRenderer(codeBlockComponent)
            },

          "addKeyboardShortcuts": () => {
            return {
              "Tab": ({editor}) => editor.chain().focus().insertContent(`\t`).run(),
            }
          }
          })
          .configure({ lowlight }),


        Youtube.configure({
        "addPasteHandler": false,
          "HTMLAttributes": {
            "class": "w-full"
          },
        }),


        Dropcursor,

        Blockquote.configure({
          HTMLAttributes: {
            "class": "bg-default-50 rounded-lg p-5"
          } 
        }),

        HorizontalRule,
        Footnotes,
        Footnote,
        FootnoteReference,
        Link.configure({

          linkOnPaste: true,
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https"],
        }),
    ],
  });




  return (
    <EditorContent
      editor={editor}
      readOnly={true}
      className={"w-full border-0 p-4 justify-center items-center"}
    />
  )
}



export default EditorReadOnly;

