'use client'
import { 
  useState,
  useContext,
  useEffect,
} from "react";
import { 
  VStack,
  Spacer,
  HStack,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SkeletonText,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  CloseButton,
  DrawerHeader,
  DrawerBody,
  Text,
} from "@chakra-ui/react";
import { Input, Chip } from "@nextui-org/react";
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, ReactNodeViewRenderer, useCurrentEditor, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import "./components/editor.css"
import { EditorSecondMenu, MainMenu } from "./components/menu/menu";
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
import { CodeBlock } from "@tiptap/extension-code-block";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight, all } from "lowlight";
import codeBlockComponent from "./components/menu/codeBlockComponent";
import Youtube from "@tiptap/extension-youtube";
import Dropcursor from "@tiptap/extension-dropcursor";
import { EditorContext } from "../providers/FeedsProvider/EditorProvider";
import Blockquote from "@tiptap/extension-blockquote";
import { Footnote, FootnoteReference, Footnotes } from "tiptap-footnotes";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Document from "@tiptap/extension-document";
import Link from "@tiptap/extension-link";






const VoidBackEditor = ({isOpen, onClose, onOpen}) => {


  const { 
    postError, 
    postLoading, 
    postSuccess,
    lastPostId,
  } = useContext(EditorContext);
  

  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);

  const [height, setHeight] = useState(480);
  const [width, setWidth] = useState(640);


  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);


  useEffect(()=> {
    if(postError)
      setErrorOpen(true);
  }, [postError])


  useEffect(()=> {
    if(postSuccess)
      setSuccessOpen(true);
  },[postSuccess])


  
  const lowlight = createLowlight(all)


  const editor = useEditor({
    onUpdate: ({editor}) => {
      setContent(editor.getJSON());
    },

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
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
      })

    ],
  });



  const handleImage = () => {
    const url = window.prompt("URL...")
    if(url){
      editor.chain().focus().setImage({ src: url }).run()
    }
  }


  const handleVideo = () => {
    const url = window.prompt("URL...")
    if(url){
      editor.chain().focus().setYoutubeVideo({ 
        src: url,
        width: Math.max(320, parseInt(width, 10)) || 640,
        height: Math.max(180, parseInt(height, 10)) || 480
      }).run()
    }
  }





  return (
    <Drawer
      isOpen={isOpen} 
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom"
      isFullHeight
    >
      <DrawerOverlay />
      <DrawerContent width="100%" height={"100%"} background={"default"} className="bg-background" overflowY={"scroll"}>

      <DrawerHeader width={"100%"} background="transparent">

        <HStack width={"100%"}>
          <VStack className="w-full" gap={0}>
            <HStack width={"100%"}>
            <MainMenu title={title} content={content} setTitle={setTitle} editor={editor} close={onClose} setContent={setContent} />
            </HStack>

            <HStack width={"100%"}>
              <EditorSecondMenu editor={editor} handleVideo={handleVideo} handleImage={handleImage} />
            </HStack>

          </VStack>

          <Spacer />

          <CloseButton onClick={onClose} />
        </HStack>
      </DrawerHeader>

      <DrawerBody overscrollY={"scroll"} width="90%" height={"100%"} alignSelf={"center"} padding={0}>

        <VStack
          maxHeight={"95%"}
          minHeight={"95%"}
          padding={"2%"}
          direction="column"
          overflowY={"scroll"}
          className="w-[80%] border-1 rounded-md p-2 place-self-center"
        >
{
              errorOpen 
                &&
              <Alert 
                  alignSelf={"center"}
                  status="error" 
                  width={"fit-content"}
                  borderRadius="3px"
                  padding={"2%"}
                  height={"fit-content"}
                >
                <AlertIcon boxSize={"5%"} />
                <Spacer/>

                <HStack>
                  <AlertTitle fontWeight={"600"}>Post Error:</AlertTitle>

                  <AlertDescription>
                    {postError}
                  </AlertDescription>
                </HStack>

                <Spacer/>

                <CloseButton
                  onClick={()=>setErrorOpen(!errorOpen)}
                />

              </Alert>
            }

            {
              successOpen
                &&
                <Alert 
                    alignSelf={"center"}
                    status="success" 
                    width={"fit-content"}
                    borderRadius="3px"
                    padding={"2%"}
                    height={"fit-content"}
                  >
                  <AlertIcon boxSize={"5%"} />
                  <Spacer/>

                  <HStack>
                    <AlertTitle fontWeight={"600"}>Post:</AlertTitle>

                    <AlertDescription>
                      <Link href={`/view/post/${lastPostId}`}>view your post</Link>
                    </AlertDescription>
                  </HStack>

                  <Spacer/>

                  <CloseButton
                    onClick={()=>setSuccessOpen(!successOpen)}
                  />

                </Alert>
            }


            <EditorContent
              aria-label="EDITOR"
              editor={editor}
              className={"w-full border-0 p-4"}
            autofocus />

          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>

  )
}



export default VoidBackEditor;

