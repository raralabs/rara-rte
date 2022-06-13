
import React  from 'react';

interface IconButtonProps {
    icon: any,
    onClick: () => void,
    isActive: boolean
}

export const IconButton = (props: IconButtonProps) => {
    return <div
        onClick={(e) => {
            e.preventDefault();
            props.onClick();
        }}
        style={{
            width: 40,
            height: 40,
            cursor: 'pointer',
            backgroundColor:props.isActive?'gray':'white'
        }}>
        {props.icon}
    </div>
}