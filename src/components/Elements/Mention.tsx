import { useFocused, useSelected } from "slate-react"
import { ElementProps } from "./Element"

import React from "react"

const Mention = ({ attributes, children, element }: ElementProps) => {
    const selected = useSelected()
    const focused = useFocused()
    return (
        <span
            {...attributes}
            contentEditable={false}
            data-cy={`mention-${element.character?.replace(' ', '-')}`}
            style={{
                padding: '3px 3px 2px',
                margin: '0 1px',
                verticalAlign: 'baseline',
                display: 'inline-block',
                borderRadius: '4px',
                // backgroundColor: '#eee',
                color:"#1A6CAA",
                fontSize: '0.9em',
                boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
            }}
        >
            {children}@{element.label}
        </span>
    )
}

export default Mention
