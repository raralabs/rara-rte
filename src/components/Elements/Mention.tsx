import { ElementProps } from "./Element"

import React from "react"

const Mention = ({ attributes, children, element,mentionItemRenderer }: ElementProps) => {

 
    return (
        <span
            {...attributes}
            contentEditable={false}
            // data-cy={`mention-${element.character?.replace(' ', '-')}`}
            style={{
                // padding: '3px 3px 2px',
                margin: '0 1px',
                verticalAlign: 'baseline',
                display: 'inline-block',
                // borderRadius: '4px',
                // backgroundColor: '#eee',
                
            }}
        >

            {/* {children} */}
            {mentionItemRenderer!=null?mentionItemRenderer({
                id:element.id,
                label:element.label,
                metaData:element.metaData
            }):<span style={{
                color:"#1A6CAA",
            }}>{element.label}</span>}
            
        </span>
    )
}

export default Mention
