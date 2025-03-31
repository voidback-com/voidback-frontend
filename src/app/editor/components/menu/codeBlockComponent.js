import { HStack } from '@chakra-ui/react'
import { SelectItem, Select } from '@nextui-org/react'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import React from 'react'


export default ({ node: { attrs: { language: defaultLanguage } }, updateAttributes, extension }) => (
  <NodeViewWrapper className="code-block">

    <HStack className='w-full justify-end max-w-[800px] min-w-[400px] place-self-center'>
      <Select 
        size='sm'
        className='w-[20%]'
        defaultSelectedKeys={[defaultLanguage ? defaultLanguage : "auto"]} 
        onSelectionChange={(k)=>updateAttributes({language: k.anchorKey})}>

        <SelectItem key={'auto'}>
          auto
        </SelectItem>

        {extension.options.lowlight.listLanguages().map((lang, index) => (
          <SelectItem key={lang}>
            {lang}
          </SelectItem>
        ))}
      </Select>
    </HStack>

    <pre>
      <NodeViewContent as="code" />
    </pre>

  </NodeViewWrapper>
)
