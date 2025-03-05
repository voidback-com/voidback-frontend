'use client'
import { HStack, VStack, Spacer, Text, Tag, Wrap } from "@chakra-ui/react";
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { Plus, Search, Trash, X } from "@geist-ui/icons";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";




export const RoomMemberPermissions = ({setMemberPermission, memberPermission}) => {


  const [permissions, setPermissions] = useState({
    is_moderator: false,
    can_delete_posts: false,
    can_remove_members: false,
    can_remove_moderators: false,
    can_add_moderators: false,
    can_post: true,
    can_like: true,
    can_dislike: true,
    can_reply: true,
    can_post_image: false,
    can_add_members: true
  });

  const [enabled, setEnabled] = useState(["can_post", "can_like", "can_dislike", "can_reply", "can_add_members"]);


  const updatePermission = () => {
    let o = Object.assign({}, permissions);

    Object.keys(permissions).map((k)=> {
      if(enabled.includes(k))
        o[k]=true;
      else
        o[k]=false;
    });

    setMemberPermission(o);
  }


  useEffect(()=> {
    updatePermission();
  }, [enabled])



  return (
    <VStack
      className="w-full h-fit border-0 rounded-lg p-10"
    >
      <CheckboxGroup
        color="default"
        defaultValue={enabled}
        label="Default Room Members Permissions"
        isRequired
        orientation="vertical"
        onChange={setEnabled}
      >
        {
          Object.keys(permissions).map((key)=> {
            return <Checkbox value={key}>{key.split("_").toString().replace(",", " ").replace(",", " ")}</Checkbox>
          })
        }
      </CheckboxGroup>
    </VStack>
  )

}
