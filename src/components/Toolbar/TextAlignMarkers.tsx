import React from 'react';
import { useSlate } from 'slate-react';
import Icons from '../../assets/icons';
import { isBlockActive, isMarkActive, TEXT_ALIGN_TYPES, toggleBlock, toggleMark } from '../../lib/functions';
import { MarkerItem } from './Markers';

interface TextAlignMarkerProps {

}

export const TextAlignMarkers = ({ }: TextAlignMarkerProps) => {
    const options = [
        {
            format: 'left',
            icon: Icons.ALIGN_LEFT,
            // iconComp:bold,
            name: "Left",
        },
        {
            format: 'center',
            icon: Icons.ALIGN_CENTER,
            name: "Center"
        },
        {
            format: 'right',
            icon: Icons.ALIGN_RIGHT,
            name: "Right"
        },
        {
            format: 'justify',
            icon: Icons.ALIGN_JUSTIFY,
            name: "Justify"
        }
    ];
    const editor = useSlate();
    return <div className='rte-marker-list' style={{
    }}>
        {options.map((markerItem) => {
            return <MarkerItem
                key={markerItem.format}
                name={markerItem.name}
                active={isBlockActive(editor, markerItem.format,'align')}
                icon={markerItem.icon}
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleBlock(editor, markerItem.format);
                }}
            />
        })}

    </div>

}
