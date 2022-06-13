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
            icon: 'bold',
            name: "Bold",
        },
        {
            format: 'italic',
            icon: "italic",
            name: "Italic"
        },
        {
            format: 'underline',
            icon: "underline",
            name: "Underline"
        },
        {
            format: 'strike',
            icon: "strike",
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
    icon?: any
}

const MarkerItem = (props: MarkerItemProps) => {
    const { onMouseDown, active, icon, name } = props;
    console.log(name,active);
    return <div
        className={`rte-marker-item rte-toolbar-btn ${active ? 'active' : ''}`}
        onMouseDown={onMouseDown}
        title={name}
        style={{
            color: active ? 'red' : 'black',
            // border:'1px solid gray',
            // padding: '4px',
            cursor: 'pointer'
        }}>
        {/* <svg>
            <use href={require('../../assets/' + icon + ".svg")} style={{

                // "--color_fill":"#000"
            }}></use>
        </svg> */}
        <img src={require('../../assets/' + icon + ".svg")} alt={name} />
    </div>
}