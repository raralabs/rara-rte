import React from 'react';
import { useSlate } from 'slate-react';
import Icons from '../../assets/icons';
import { isMarkActive, toggleMark } from '../../lib/functions';
import { MarkerItem } from './Markers';

interface TextAlignMarkerProps {

}

export const TextAlignMarkers = ({ }: TextAlignMarkerProps) => {
    const options = [
        {
            format: 'bold',
            icon: Icons.ALIGN_LEFT,
            // iconComp:bold,
            name: "Bold",
        },
        {
            format: 'italic',
            icon: Icons.ALIGN_CENTER,
            name: "Italic"
        },
        {
            format: 'underline',
            icon: Icons.ALIGN_RIGHT,
            name: "Underline"
        },
        {
            format: 'strike',
            icon: Icons.ALIGN_JUSTIFY,
            name: "Strike Through"
        }
    ];
    const editor = useSlate();
    return <div className='rte-marker-list' style={{
    }}>
        {options.map((markerItem) => {
            return <MarkerItem
                key={markerItem.format}
                name={markerItem.name}
                active={isMarkActive(editor, markerItem.format)}
                icon={markerItem.icon}
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleMark(editor, markerItem.format);
                }}
            />
        })}

    </div>

}
