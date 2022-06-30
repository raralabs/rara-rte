import React, { useMemo, useState } from 'react'
import { searchMockedCharacter } from '../Mock/SearchMocker';
import { CustomElement, MentionItemProps } from '../types';
import { serializeSlateData } from '../utils/serializer';
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
            console.log(serializeSlateData(JSON.parse(val)));
            setEditorData(val);
        }} 
        isMentionLoading={true}
        onMentionQuery={async (query:string)=>{
            let chars=await searchMockedCharacter(query)
            let results=chars.map((i,index)=>{
                return {
                "label":i,
                "id":i,
                metaData:{
                    name:i,
                    index:index
                }
                }
            })
            return results;
        }}
        mentionOptionRenderer={(mentionOptionItem:MentionItemProps)=>{
            return <div style={{
                fontSize:20,
                fontWeight:'bold',
                color:'red'
            }}>{mentionOptionItem.label} {mentionOptionItem.metaData?.index}</div>
        }}
        mentionItemRenderer={(mentionItem:MentionItemProps)=>{
            return <p style={{
                margin:0,
                color:'red'
                // display:'flex',
                // gap:10,
                // fontSize:'inherit'
            }}>
                <img src='https://www.w3schools.com/w3images/mac.jpg' style={{
                    height:10,
                    width:10,
                    borderRadius:'50%',
                    marginRight:10

                }}/>

                <span data-slate-string='true'>
                    {mentionItem.label}
                </span>

            </p>
        }}
        />
}
RaraEditorExample.defaultName = "RaraEditorExample";

export default RaraEditorExample;