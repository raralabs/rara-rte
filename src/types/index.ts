
// NODE TYPES

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
    underline?:boolean
}
export type CustomElement =ColoredElement|ChecklistElement|HeadingElement|ParagraphElement


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
    level?: number
    children: CustomTextElement[]
}


export interface RaraEditorProps{
    value:string;
    onChange:(val:string)=>void
}

