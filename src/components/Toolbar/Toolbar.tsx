import React from 'react';
import { useSlate } from 'slate-react';
import Icons from '../../assets/icons';
import { insertLink, isBlockActive, toggleBlock, unwrapLink } from '../../lib/functions';
import { ColorPicker } from '../ColorPicker';
import { Divider } from './Divider';
import { Headings } from './Headings';
import { MarkerItem, Markers } from './Markers';
import { TextAlignMarkers } from './TextAlignMarkers';

interface ToolbarProps {
    items: any[]
}
export const Toolbar = ({ }: ToolbarProps) => {
    const editor = useSlate()
    // console.log(editor);
    return (
        <div className='rte-toolbar'
        >
            <ColorPicker />
            <Divider />
            <Markers />
            <Divider />
            <MarkerItem
                key={'block-quote'}
                icon={Icons.QUOTE}
                name="Block Quot"
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleBlock(editor, 'block-quote');
                }}
                active={isBlockActive(editor, 'block-quote')}
            />
            <Divider />
            <Headings />
            <Divider />
            <TextAlignMarkers/>
            <Divider />
            <MarkerItem
                key={'code'}
                icon={Icons.CODE}
                name="Code"
                active={isBlockActive(editor, 'code')}
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleBlock(editor, 'code');
                }}
            />
            <Divider />
            <MarkerItem
                key={'check-list-item'}
                icon={Icons.CLIST}
                name="Checklist"
                active={isBlockActive(editor, 'check-list-item')}
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleBlock(editor, 'check-list-item');
                }}
            />
            <Divider />
            <MarkerItem
                icon={Icons.LINK}
                key='link'
                name="Link"
                active={isBlockActive(editor, 'link')}
                onMouseDown={(e) => {
                    e.preventDefault()
                    console.log("Link clicked", isBlockActive(editor, 'link'))
                    if (!isBlockActive(editor, 'link')) {
                        const url = window.prompt('Enter the URL of the link:')
                        if (!url) return
                        insertLink(editor, url)
                    }
                    else {
                        unwrapLink(editor)
                    }
                }}
            />
        </div>
    )
}