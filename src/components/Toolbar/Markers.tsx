import React from 'react';
import { useSlate } from 'slate-react';
import { isMarkActive, toggleMark } from '../../lib/functions';
import './styles.css'

interface MarkerProps {

}

export const Markers = ({ }: MarkerProps) => {
    const options = [
        {
            format: 'bold',
            icon: 'bold.svg',
            name: "Bold",
        },
        {
            format: 'italic',
            icon: "italic.svg",
            name: "Italic"
        },
        {
            format: 'underline',
            icon: "underline.svg",
            name: "Underline"
        },
        {
            format: 'strike',
            icon: "strike.svg",
            name: "Strike Through"
        }
    ];
    const editor = useSlate();
    return <div className='rte-marker-list' style={{
    }}>
        {options.map((markerItem) => {
            return <MarkerItem
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


interface MarkerItemProps {
    name: string,
    active: boolean,
    onMouseDown: (e: any) => void,
    icon?: any,
    label?: any
}

export const MarkerItem = (props: MarkerItemProps) => {
    const { onMouseDown, active, icon, name, label } = props ?? {};
    return <div
        className={`rte-marker-item rte-toolbar-btn ${active ? 'active' : ''}`}
        onMouseDown={onMouseDown}
        title={name}
        style={{
            cursor: 'pointer'
        }}>
        {/* <svg>
            <use href={require('../../assets/' + icon + ".svg")} style={{

                // "--color_fill":"#000"
            }}></use>
        </svg> */}
        {icon ?
            <img src={require('../../assets/' + icon)} alt={name} /> : label}
    </div>
}