import { Transforms } from "slate"
import { RaraEditorType } from "../../types"
import { deserializeHTMLData } from "../../utils/serializer"

const withHtml = (editor:RaraEditorType) => {
    const { insertData, isInline } = editor

    editor.isInline = element => {
        return element.type === 'link' ? true : isInline(element)
    }

    // editor.isVoid = element => {
    //     return element.type === 'image' ? true : isVoid(element)
    // }

    editor.insertData = data => {
        const html = data.getData('text/html')

        if (html) {
            const parsed = new DOMParser().parseFromString(html, 'text/html')
            const fragment = deserializeHTMLData(parsed.body)
            console.log("GOT FRAG",fragment);
            if(fragment){
                Transforms.insertFragment(editor, fragment as [])
            }
            return
        }

        insertData(data)
    }

    return editor
}
export default withHtml;