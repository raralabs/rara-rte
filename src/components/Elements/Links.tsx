

import React from 'react';
import { ReactEditor, useReadOnly, useSlateStatic } from 'slate-react';
import {
    Transforms,
    Element as SlateElement,

} from 'slate'
interface LinkElementProps {
    attributes?: any,
    children?: any,
    element?: any
}
const LinkElement = ({ attributes, children, element }: LinkElementProps) => {
    const editor = useSlateStatic()
    const readOnly = useReadOnly()
    const { url } = element
    return (
        <a href={element.url} {...attributes}>
        {children}
    </a>
    )
}

export default LinkElement;