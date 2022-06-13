import React from 'react';

interface ToolbarProps {
    items: any[]
}
export const Toolbar = ({ items }: ToolbarProps) => {
    // const editor = useSlate()
    // console.log(editor);
    return (
        <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'nowrap',
            height:20,
            alignItems:'center'
        }}>
            {items}
        </div>
    )
}