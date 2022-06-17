
// NODE TYPES

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
export type CustomElement =ColoredElement|ChecklistElement|HeadingElement|ParagraphElement|LinkElement


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
    type?: 'heading'
    level?: 1|2|3|4|5|6,
    children: CustomTextElement[]
}

export type LinkElement={
    type: 'link',
    url?: string,
    children: CustomTextElement[],
}


export interface RaraEditorProps{
    value?:string;
    onChange?:(val:string)=>void,
    readOnly?:boolean,
    onCheckboxChange?:(checked:boolean,value:string)=>void
}


export type RaraEditorType=BaseEditor & ReactEditor & HistoryEditor