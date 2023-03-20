// NODE TYPES

import { Dispatch, ReactNode, SetStateAction } from 'react';
import { BaseEditor, BaseRange } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export type ParagraphElement = {
  type?: 'paragraph';
  align?: string;
  color?: string;
  children: CustomTextElement[];
  id?:string|number
};
export type CustomTextElement = {
  text?: string;
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  underline?: boolean;
  type?: string;
  children?: any[];
  id?:string|number
};

export type CodeElement = {
  align?: string;
  type?: 'code';
  children?: CustomTextElement[];
  id?:string|number
};
export type BlockQuoteElement = {
  align?: string;
  type?: 'block-quote' | string;
  children?: CustomTextElement[];
  id?:string|number
};
export type CustomElement =
  | BlockQuoteElement
  | CodeElement
  | ColoredElement
  | ChecklistElement
  | HeadingElement
  | ParagraphElement
  | LinkElement
  | MentionElement;

export type ElementType =
  | 'color'
  | 'block-quote'
  | 'code'
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'heading-four'
  | 'heading-five'
  | 'check-list-item'
  | 'paragraph'
  | 'link'
  | 'mention'
  | undefined;

export type ColoredElement = {
  align?: string;
  type: 'color';
  color?: string;
  children: any[];
  id?:string|number

};
export type ChecklistElement = {
  align?: string;
  type: 'check-list-item';
  checked: boolean;
  children: CustomTextElement[];
  id?:string|number

};
export type HeadingElement = {
  align?: string;
  type?:
    | 'heading-one'
    | 'heading-two'
    | 'heading-three'
    | 'heading-four'
    | 'heading-five'
    | 'heading-six'
    | 'bulleted-list'
    | 'list-item'
    | 'numbered-list'
    | 'mentionContact';
  children: CustomTextElement[];
  id?:string|number

};

export type MentionElement = {
  align?: string;
  type?: 'mention' | 'mentionContact';
  id?: number | string;
  label: string;
  metaData?: Record<string, string | number>;
  children: CustomTextElement[];
};

export type LinkElement = {
  align?: string;
  type: 'link';
  url?: string;
  children: CustomTextElement[];
  id?:string|number

};

export type RaraEditorProps = {
  value?: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  onCheckboxChange?: (checked: boolean, value: string) => void;
  onMentionListChange?: (mentionedItems: MentionItemProps[]) => void;
  // onMentionQuery?: (query: string) => Promise<MentionItemProps[]>;
  onMentionQuery?: MentionItemProps[];
  onMentionContactQuery?: MentionItemProps[];
  isMentionLoading?: boolean;
  mentionOptionRenderer?: (mentionOptionItem: MentionItemProps) => ReactNode;
  mentionContactOptionRenderer?: (
    mentionOptionItem: MentionItemProps
  ) => ReactNode;
  mentionItemRenderer?: (mentionOptionItem: MentionItemProps) => ReactNode;
  mentionContactItemRenderer?: (
    mentionOptionItem: MentionItemProps
  ) => ReactNode;
  mentionDetailRenderer?: (mentionOptionItem: MentionItemProps) => ReactNode;
  mentionContactDetailRenderer?: (
    mentionOptionItem: MentionItemProps
  ) => ReactNode;
  styles?: React.CSSProperties;
  onMentionContact?: (e: number[]) => void;
  onMentionUser?: (e: string[]) => void;
  autoFocus?:boolean
};

export type MentionItemProps = {
  label: string | number;
  id: string | number;
  metaData: Record<string | number, number | string>;
};

export type RaraEditorType = BaseEditor & ReactEditor & HistoryEditor;

export interface Range extends BaseRange {
  highlight: boolean;
}
export interface IediterHooks {
  index: number;
  target: Location | BaseRange | null | undefined;
  searchResults: MentionItemProps[];
  setIndex: (e: number) => void;
  insertMention: (editor: RaraEditorType, item: MentionItemProps) => void;
  insertMentionContact: (
    editor: RaraEditorType,
    item: MentionItemProps
  ) => void;
  setTarget: Dispatch<SetStateAction<BaseRange | null | undefined>>;
  setSearchResults: Dispatch<SetStateAction<MentionItemProps[]>>;
  editor: RaraEditorType;
  search: string;
  value?: string;
  mentionIndicator: string | null;
  onMentionContact?: (e: number[]) => void;
  onMentionUser?: (e: string[]) => void;
  

}
