import React from 'react';
import { useSlate } from 'slate-react';
import { insertLink, isBlockActive, toggleBlock, unwrapLink } from '../../lib/functions';
import { ColorPicker } from '../ColorPicker';
import { IconButton } from '../IconButton';
import { Divider } from './Divider';
import { Headings } from './Headings';
import { MarkerItem, Markers } from './Markers';

interface ToolbarProps {
    items: any[]
}
export const Toolbar = ({ items }: ToolbarProps) => {
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
                icon={'quote.svg'}
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
            <MarkerItem
                icon={'code.svg'}
                name="Code"
                active={isBlockActive(editor, 'code')}
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleBlock(editor, 'code');
                }}
            />
            <Divider />
            <MarkerItem
                icon={'clist.svg'}
                name="Checklist"
                active={isBlockActive(editor, 'check-list-item')}
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleBlock(editor, 'check-list-item');
                }}
            />
            <Divider />
            <MarkerItem
                icon={'link.svg'}
                name="Link"
                active={isBlockActive(editor, 'link')}
                onMouseDown={(e) => {
                    e.preventDefault()
                    console.log("Link clicked",isBlockActive(editor,'link'))
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