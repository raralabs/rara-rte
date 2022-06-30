
// NODE TYPES

import { ReactNode } from "react"
import { BaseEditor } from "slate"
import { HistoryEditor } from "slate-history"
import { ReactEditor } from "slate-react"

export type ParagraphElement = {
    type?: 'paragraph',
    align?: string,
    color?: string,
    children: CustomTextElement[]
}
export type CustomTextElement={
    text?:string,
    bold?:boolean,
    italic?:boolean,
    strike?:boolean,
    underline?:boolean,
    type?:string,
    children?:any[]
}

export type CodeElement={
    type?:'code',
    children?:CustomTextElement[]
}
export type BlockQuoteElement={
    type?:'block-quote',
    children?:CustomTextElement[]
}
export type CustomElement =BlockQuoteElement|CodeElement|ColoredElement|ChecklistElement|HeadingElement|ParagraphElement|LinkElement|MentionElement


export type ColoredElement={
    type:'color',
    color?:string,
    children:any[]
}
export type ChecklistElement={
    type: 'check-list-item',
    checked: boolean,
    children: CustomTextElement[],
}
export type HeadingElement = {
    type?: 'heading-one'|'heading-two'|'heading-three'|'heading-four'|'heading-five'
    children: CustomTextElement[]
}

export type MentionElement={
    type?:'mention',
    id?:any,
    label?:string,
    metaData?:any,
    children:CustomTextElement[]
}

export type LinkElement={
    type: 'link',
    url?: string,
    children: CustomTextElement[],
}


export type RaraEditorProps={
    value?:string;
    onChange?:(val:string)=>void,
    readOnly?:boolean,
    onCheckboxChange?:(checked:boolean,value:string)=>void,
    onMentionListChange?:(mentionedItems:MentionItemProps[])=>void,
    onMentionQuery?:(query:string)=>Promise<MentionItemProps[]>,
    isMentionLoading?:boolean,
    mentionOptionRenderer?:(mentionOptionItem:MentionItemProps)=>ReactNode,
    mentionItemRenderer?:(mentionOptionItem:MentionItemProps)=>ReactNode
}

export type MentionItemProps={
    label:string,
    id:any,
    metaData?:any
}

export type RaraEditorType=BaseEditor & ReactEditor & HistoryEditor