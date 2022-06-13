import React from 'react';
import { useSlate } from 'slate-react';
import { isBlockActive, toggleBlock } from '../../lib/functions';
import { ColorPicker } from '../ColorPicker';
import { IconButton } from '../IconButton';
import { Divider } from './Divider';
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
        </div>
    )
}