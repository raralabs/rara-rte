
import { ReactEditor } from 'slate-react'
import { BaseEditor, Range } from 'slate'
import { HistoryEditor } from 'slate-history'
import { Editor, Transforms, Element as SlateElement } from 'slate'
import { CustomElement, LinkElement, MentionElement, MentionItemProps, RaraEditorType } from '../types'

export const LIST_TYPES = ['numbered-list', 'bulleted-list']
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

export const insertMention = (editor: RaraEditorType,item:MentionItemProps) => {
    const mention: MentionElement = {
        type: 'mention',
        label:item.label,
        id:item.id,
        metaData:item.metaData,
        children: [{ text: '' }],
    }
    Transforms.insertNodes(editor, mention)
    Transforms.move(editor)
}

export const isMarkActive = (editor: BaseEditor & ReactEditor & HistoryEditor, format: string) => {
    const marks: { [index: string]: any } = Editor.marks(editor) ?? {};
    return marks ? !!marks[format] === true : false
}

export const toggleColor = (editor: BaseEditor & ReactEditor & HistoryEditor, format: string, value: any = true) => {
    // const color = getColorForSelection(editor, format)
    Editor.addMark(editor, format, value)
}

export const toggleMark = (editor: BaseEditor & ReactEditor & HistoryEditor, format: string, value: any = true) => {
    const isActive = isMarkActive(editor, format)

    if (isActive && format != 'color') {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, value)
    }
}
export const getColorForSelection = (editor: BaseEditor & ReactEditor & HistoryEditor, format: string) => {
    const marks: { [index: string]: any } = Editor.marks(editor) ?? {};
    return marks ? marks[format] : null;
}

export const getHeadingLevelForSelection = (editor: BaseEditor & ReactEditor & HistoryEditor, format: string) => {
    const marks: { [index: string]: any } = Editor.marks(editor) ?? {};
    return marks ? marks[format] : null;
}


export const isBlockActive = (editor: BaseEditor & ReactEditor & HistoryEditor, format: any,blockType:any='type') => {
    const { selection } = editor
    if (!selection) return false
    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n: { [index: string]: any }) => {
                return !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    // n.type!=null &&
                    n[blockType] === format;
            }
        }
        ));

    return !!match
}

export const toggleBlock = (editor: BaseEditor & ReactEditor & HistoryEditor, format: any) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    )
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type != null &&
            LIST_TYPES.includes(n.type) &&
            // n.type == 'paragraph' &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    })
    let newProperties: Partial<SlateElement>
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {
            align: isActive ? undefined : format,
        }
    } else {
        newProperties = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        }
    }
    Transforms.setNodes<SlateElement>(editor, newProperties)

    if (!isActive && isList) {
        const block: CustomElement = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

export const insertLink = (editor: BaseEditor & ReactEditor & HistoryEditor, url: any) => {
    if (editor.selection) {
        wrapLink(editor, url)
    }
}
const wrapLink = (editor: BaseEditor & ReactEditor & HistoryEditor, url: string) => {
    // if (isBlockActive(editor, 'link')) {
    //     unwrapLink(editor)
    // }

    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link: LinkElement = {
        type: 'link',
        url,
        children: isCollapsed ? [{ text: url }] : [],
    }

    if (isCollapsed) {
        Transforms.insertNodes(editor, link)
    } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: 'end' })
    }
}

export const unwrapLink = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    })
}

export const withInlines = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    const { insertData, insertText, isInline } = editor
    editor.isInline = (element: any) =>
        ['link', 'button','mention'].includes(element.type) || isInline(element)
    editor.insertText = text => {
        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertText(text)
        }
    }
    editor.insertData = data => {
        const text = data.getData('text/plain')
        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}

export const withMentions = (editor: RaraEditorType) => {
    const { isInline, isVoid } = editor

    editor.isInline = (element: any) => {
        return element.type === 'mention' ? true : isInline(element)
    }

    editor.isVoid = (element: any) => {
        return element.type === 'mention' ? true : isVoid(element)
    }
    return editor
}


export const isUrl = (url: any) => {
    //TODO: Done workaround only, later should   be changed
    return url.includes("http");
}