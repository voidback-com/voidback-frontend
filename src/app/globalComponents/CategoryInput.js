'use client'
import { HStack, VStack, Spacer, Text, Tag, Wrap } from "@chakra-ui/react";
import { 
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { Plus, Search, Trash, X } from "@geist-ui/icons";
import { Chip, Input } from "@nextui-org/react";



const Category = ({handleDelete, text}) => {

  return (
    <Chip 
      variant="bordered"
      size="sm"
      className="p-4 border-1"
      onDoubleClick={handleDelete}
      endContent={<X size={18} />}
    >
      {text}
    </Chip>
  )
}



export const CategoryInput = ({setCategories, categories, hideBorder}) => {

  const [category, setCategory] = useState('');


  const handleAdd = () => {

    if(!category.length) return;

    const newCategory = {"tag": category};

    setCategories(x=>x.filter((i)=> i.tag!=newCategory.tag));

    setCategories(p=>[...p, newCategory]);

    setCategory("");

  }


  const handleRemove = (category) => {
    setCategories(x=>x.filter((i)=> i.tag!=category.tag));
  }



  return (
    <VStack
      className="w-full h-fit border-1 rounded-lg p-10"
      style={{borderWidth: hideBorder && 0 }}
    >
      <Wrap>
      {
        categories.length
        ?
        categories.map((x)=> {
          return <Category text={x.tag} handleDelete={()=>handleRemove(x)} />;
        })

        : null
      }
      </Wrap>

      {

        categories.length < 5
          ?
      <Input 
        isRequired
        label="Tags"
        placeholder="tag... (hit Enter)" 
        value={category}
        maxLength={20}
        onChange={(e)=>setCategory(e.target.value)}
        onKeyDown={(e)=>{
        if(e.key==="Enter")
          handleAdd();
      }} />
      :null
      }
    </VStack>
  )

}
