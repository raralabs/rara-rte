
import React, { ReactNode } from 'react';
import { CustomElement, MentionItemProps } from '../../types';
import CheckListItemElement from './Checklist';
import LinkElement from './Links';
import Mention from './Mention';

export interface ElementProps {
    attributes?: any,
    children?: any,
    element: CustomElement,
    onCheckboxChange?: (checked: boolean, value: string) => void,
    onMentionQuery?:(query:string)=>Promise<MentionItemProps[]>,
    isMentionLoading?:boolean,
    mentionItemRenderer?:(mentionOptionItem:MentionItemProps)=>ReactNode
}

const Element = ({ attributes, children, element, onCheckboxChange,mentionItemRenderer }: ElementProps) => {
    const style = { 
        // textAlign: element.align
    }
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            )
        // case 'bulleted-list':
        //     return (
        //         <ul style={style} {...attributes}>
        //             {children}
        //         </ul>
        //     )
        case 'heading-one':
            return (
                <h1 className='rte-heading-one' style={{ ...style }} {...attributes}>
                    {children}
                </h1>
            )
        case 'heading-two':
            return (
                <h2 className='rte-heading-two' style={{ ...style }} {...attributes}>
                    {children}
                </h2>
            )
        case 'heading-three':
            return (
                <h3 className='rte-heading-three' style={{ ...style }} {...attributes}>
                    {children}
                </h3>
            )
        case 'heading-four':
            return (
                <h4 className='rte-heading-four' style={{ ...style }} {...attributes}>
                    {children}
                </h4>
            )
        case 'heading-five':
            return (
                <h5 className='rte-heading-five' style={{ ...style }} {...attributes}>
                    {children}
                </h5>
            )
        // case 'list-item':
        //     return (
        //         <li style={style} {...attributes}>
        //             {children}
        //         </li>
        //     )
        case 'check-list-item':
            return <CheckListItemElement
                onCheckboxChange={onCheckboxChange}
                attributes={attributes} children={children} element={element} />
        case 'mention':
            return <Mention
                children={children}
                element={element}
                attributes={attributes}
                mentionItemRenderer={mentionItemRenderer}
            />
        // return <
        // case 'list-item':
        //     return (
        //         <li style={style} {...attributes}>
        //             {children}
        //         </li>
        //     )
        // case 'numbered-list':
        //     return (
        //         <ol style={style} {...attributes}>
        //             {children}
        //         </ol>
        //     )
        case 'code':
            return <pre className='rte-pre'{...attributes}>
                {children}
            </pre>;
        case 'link':
            return <LinkElement attributes={attributes} children={children} element={element} />
        default:
            return (
                <p className='rte-paragraph' style={style} {...attributes}>
                    {children}
                </p>
            )
    }
}

export default Element;