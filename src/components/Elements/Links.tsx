

import React from 'react';
interface LinkElementProps {
    attributes?: any,
    children?: any,
    element?: any
}
const LinkElement = ({ attributes, children, element }: LinkElementProps) => {
    return (
        <a href={element.url} {...attributes}>
        {children}
    </a>
    )
}

export default LinkElement;