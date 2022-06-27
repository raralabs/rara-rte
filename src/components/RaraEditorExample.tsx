import React, { useMemo, useState } from 'react'
// Import the Slate editor factory.
import RaraEditor from "./RaraEditor/RaraEditor"


const RaraEditorExample = () => {
    const [editorData, setEditorData] = useState('[{"type":"paragraph","children":[{"text":""}]}]');
    return <RaraEditor
        value={editorData}
        onCheckboxChange={(checked, value) => {
            console.log("Checkbox Toggled", checked, value);
        }}
        onMentionListChange={(mentiondItems)=>{
            console.log("Mentioned Item Changed",mentiondItems);
        }}
        onChange={(val) => {
            setEditorData(val);
        }} />
}
RaraEditorExample.defaultName = "RaraEditorExample";

export default RaraEditorExample;