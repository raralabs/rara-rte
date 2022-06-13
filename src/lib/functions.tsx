
import { ReactEditor } from 'slate-react'
import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { Editor } from 'slate'
export const isMarkActive = (editor: BaseEditor & ReactEditor & HistoryEditor, format: string) => {
    const marks: { [index: string]: boolean } = Editor.marks(editor) ?? {};
    console.log("getColorForSelection", marks);
    return marks ? !!marks[format] === true : false
}

export const toggleMark = (editor: BaseEditor & ReactEditor & HistoryEditor, format: string, value: any = true) => {
    const isActive = isMarkActive(editor, format)
    if (isActive&&format!='color') {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, value)
    }
}