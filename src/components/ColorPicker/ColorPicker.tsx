import React, { useState } from 'react';
import { useSlate } from 'slate-react';
import { getColorForSelection, toggleMark } from '../../lib/functions';
import './styles.css';
interface ColorPickerProps {
    defaultColor?: string,
    // color?: string,
    onChange?: (color: string, e: any) => void
}

const LIST_COLORS = ["black", "#450CA3", "#4361EE", "#4CC9F0", "#219653", "#AACC00", "#FDC500", "#FB8500", "#FF006E", "#D90429", "#6A040F"];
const COLOR_ITEM_SIZE = 20;

const ColorPicker = (props: ColorPickerProps) => {
    const {
        defaultColor = "black",
        // color,
        onChange
    } = props;
    const editor = useSlate();
    const color = getColorForSelection(editor, 'color');

    return <div className='parent-color-picker' style={{
        position: 'relative'
    }}>
        <div
            className='color-picker-main'

            onClick={(e) => {
                e.preventDefault();
            }}
            // onMouseEnter={e => {
            //     e.preventDefault();
            //     setVisible(!isVisible);
            // }}
            // onMouseLeave={(e) => {
            //     setVisible(!isVisible);
            // }}
            // onClick={() => {
            //     setVisible(!isVisible);

            // }}
            style={{
                backgroundColor: color ?? defaultColor,
                borderRadius: '50%',
                minWidth: COLOR_ITEM_SIZE,
                minHeight: COLOR_ITEM_SIZE,
                cursor: 'pointer'
            }}
        >

        </div>
        <div
            className='color-picker-content'
            style={{
                position: 'absolute',
                zIndex: 100,
                backgroundColor: 'white',
                boxShadow: `0 4px 8px 0 rgba(0,0,0,0.2)`,
                padding: 10,
                // display: 'flsex',
                gap: 10,
                flexWrap: 'wrap',
                width: (COLOR_ITEM_SIZE + 10) * 11,
                left: COLOR_ITEM_SIZE,
                top: -15,
                borderRadius: 10
            }}>
            {LIST_COLORS.map((colorValue) => {
                return <div
                    key={colorValue}
                    onClick={(e) => {
                        // e.preventDefault();
                        // onChange && onChange(colorValue,e);

                        toggleMark(editor, 'color', colorValue == color ? null : colorValue);
                    }}
                    style={{
                        backgroundColor: colorValue,
                        borderRadius: '50%',
                        minWidth: COLOR_ITEM_SIZE,
                        minHeight: COLOR_ITEM_SIZE,
                        // border:colorValue==color?'4px solid':'none',
                        // borderStyle:colorValue==color?'inset':'none',
                        // boxSizing: 'border-box',
                        cursor: 'pointer'
                    }}>

                </div>
            })}

        </div>
    </div>

}
ColorPicker.defaultName = "ColorPicker";
export default ColorPicker;