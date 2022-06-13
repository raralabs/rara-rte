
import React from 'react';
interface IconButtonProps {
    name: string,
    active: boolean,
    onMouseDown: (e: any) => void,
    icon?:any
}

export const IconButton = ({ name, active, onMouseDown,icon }: IconButtonProps) => {
    return <div
        onMouseDown={onMouseDown}
        title={name}
        style={{
            color: active ? 'red' : 'black',
            // border:'1px solid gray',
            padding:'4px',
            cursor:'pointer'
        }}>
        {icon??name}
    </div>
}