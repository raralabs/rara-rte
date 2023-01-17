// NODE TYPES

import { ReactNode } from 'react';
import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export type ParagraphElement = {
  type?: 'paragraph';
  align?: string;
  color?: string;
  children: CustomTextElement[];
};
export type CustomTextElement = {
  text?: string;
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  underline?: boolean;
  type?: string;
  children?: any[];
};

export type CodeElement = {
  align?: string;
  type?: 'code';
  children?: CustomTextElement[];
};
export type BlockQuoteElement = {
  align?: string;
  type?: 'block-quote';
  children?: CustomTextElement[];
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
};
export type ChecklistElement = {
  align?: string;
  type: 'check-list-item';
  checked: boolean;
  children: CustomTextElement[];
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
    | 'numbered-list';
  children: CustomTextElement[];
};

export type MentionElement = {
  align?: string;
  type?: 'mention';
  id?: any;
  label?: string;
  metaData?: any;
  children: CustomTextElement[];
};

export type LinkElement = {
  align?: string;
  type: 'link';
  url?: string;
  children: CustomTextElement[];
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
};

export type MentionItemProps = {
  label: string | number;
  id: any;
  metaData?: any;
};

export type RaraEditorType = BaseEditor & ReactEditor & HistoryEditor;
