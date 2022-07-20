import React from 'react';
import { useSlate } from 'slate-react';
import Icons from '../../assets/icons';
import {isBlockActive, toggleBlock } from '../../lib/functions';
import { MarkerItem } from './Markers';
import './styles.css'
interface HeadingsProps { };

const HEADINGS_LIST: {
    [index: string]: {
        icon: string,
        name: string,
        label: string
    }
} = {
    "heading-one": {
        icon: "heading.svg",
        name: "Heading 1",
        label: "H1",
    },
    "heading-two": {
        icon: "heading.svg",
        name: "Heading 2",
        label: "H2",
    },
    "heading-three": {
        icon: "heading.svg",
        name: "Heading 3",
        label: "H3",
    },
    // "heading-four": {
    //     icon: "heading.svg",
    //     name: "Heading 4",
    //     label: "H4",
    // },
    // "heading-five": {
    //     icon: "heading.svg",
    //     name: "Heading 5",
    //     label: "H5",
    // }
}


export const Headings = (props: HeadingsProps) => {
    const { } = props;
    const editor = useSlate();
    return <div

        className='parent-heading-picker'


    >
        <div className='heading-picker-main'>
            <MarkerItem onMouseDown={(e) => {
                e.preventDefault();
            }} icon={Icons.HEADING} active={false} name="Heading" />
        </div>
        <div className='heading-picker-content' style={{
            position: 'absolute',
            zIndex: 100,
            backgroundColor: 'white',
            boxShadow: `0 4px 8px 0 rgba(0,0,0,0.2)`,
            padding: 10,
            // display: 'flsex',
            gap: 10,
            flexWrap: 'wrap',
            width: 28,
            left: 0,
            top: 20,
            borderRadius: 10
        }}>
            {Object.keys(HEADINGS_LIST).map((headingKey) => {
                const headingItem = HEADINGS_LIST[headingKey];
                return <div 
                key={headingKey}
                style={{
                    cursor: 'pointer',
                    padding: 4,
                    fontSize: 16,
                    color: isBlockActive(editor, headingKey) ? "black" : "gray"
                }} onClick={(e) => {
                    e.preventDefault();
                    toggleBlock(editor, headingKey);
                }}>
                    {headingItem.label}
                </div>
            })}
        </div>

    </div>


}