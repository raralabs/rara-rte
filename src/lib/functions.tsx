
import { ReactEditor } from 'slate-react'
import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { Editor ,Transforms,Element as SlateElement} from 'slate'
import { CustomElement } from '../types'

export const LIST_TYPES = ['numbered-list', 'bulleted-list']
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']



export const isMarkActive = (editor: BaseEditor & ReactEditor & HistoryEditor, format: string) => {
    const marks: { [index: string]: boolean } = Editor.marks(editor) ?? {};
    return marks ? !!marks[format] === true : false
}

export const toggleColor = (editor: BaseEditor & ReactEditor & HistoryEditor, format: string, value: any = true) => {
    const color = getColorForSelection(editor, format)
    Editor.addMark(editor, format, value)
}

export const toggleMark = (editor: BaseEditor & ReactEditor & HistoryEditor, format: string, value: any = true) => {
    const isActive = isMarkActive(editor, format)
    
    console.log("TOGGLE MARK",format,value);
    if (isActive && format!='color') {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, value)
    }
}
export const getColorForSelection = (editor: BaseEditor & ReactEditor & HistoryEditor, format: string) => {
    const marks: { [index: string]: any } = Editor.marks(editor) ?? {};
    console.log("getColorForSelection",marks,format);
    return marks ? marks[format] : null;
}

export const getHeadingLevelForSelection= (editor: BaseEditor & ReactEditor & HistoryEditor, format: string) => {
    const marks: { [index: string]: any } = Editor.marks(editor) ?? {};
    // console.log("HEADING LEVEL",marks);
    return marks ? marks[format] : null;
}


export const isBlockActive = (editor: BaseEditor & ReactEditor & HistoryEditor, format: any, blockType: string = 'type') => {
    const { selection } = editor
    if (!selection) return false
    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n: { [index: string]: any }) => {
                // console.log(n,blockType,format);
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