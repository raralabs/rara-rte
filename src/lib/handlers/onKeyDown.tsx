import { RaraEditorType } from "../../types";
import { serializeSlateData } from "../../utils/serializer";
import { toggleBlock, toggleMark } from "../functions";

const onKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    editor: RaraEditorType
) => {
    //metaKey to track Cmd of mac,ALT of window,  *** of linux keyboard
    console.log(editor);
    if (e.key === 'Enter') {


        //TODO  JUGGAD DONE,NEED TO CHANGE LATER
        //TODO  JUGGAD DONE,NEED TO CHANGE LATER
        //TODO  JUGGAD DONE,NEED TO CHANGE LATER
        //TODO  JUGGAD DONE,NEED TO CHANGE LATER
        //TODO  JUGGAD DONE,NEED TO CHANGE LATER
        //TODO  JUGGAD DONE,NEED TO CHANGE LATER


        //check if cursor in in last list item
        //if it is empty, exit block
        //if it is not empty, another item addeed by slate
        console.log("RARA Editor", editor.children, editor.selection?.anchor);
        const indexOfDecendent = editor.selection?.anchor.path.at(0);
        if (indexOfDecendent) {
            //got the path
            const decendent = editor.children.at(indexOfDecendent);
            console.log("Last Cursor was on", decendent)
            if (decendent?.type == 'check-list-item' && '' == serializeSlateData(decendent?.children ?? [])) {
                console.log("Now toggle the block")
                toggleBlock(editor, 'check-list-item');
            }
            // const childText=serializeSlateData()
        }
    }
   
    if (e.metaKey && e.key === 'b') {
        e.preventDefault();
        toggleMark(editor, 'bold');
    }
    if (e.metaKey && e.key === 'i') {
        e.preventDefault();
        toggleMark(editor, 'italic');
    }
    if (e.metaKey && e.key === 'u') {
        e.preventDefault();
        toggleMark(editor, 'underline');
    }

}

export default onKeyDown;