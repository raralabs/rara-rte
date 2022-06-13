import React, { useMemo,useState } from 'react'
// Import the Slate editor factory.
import { createEditor } from 'slate'
import RaraEditor from "./RaraEditor/RaraEditor"
import { Slate, Editable, withReact } from 'slate-react'


const RaraEditorExample=()=>{
    const editor = useMemo(() => withReact(createEditor()), [])

    const [editorData,setEditorData]=useState([]);
    return <RaraEditor value='' onChange={()=>{}}/>
}