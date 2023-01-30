import * as React from 'react';
import Icons from '../../assets/icons';
import { colors } from '../../utils/serializer';
import { useSlate } from 'slate-react';
import { getColorForSelection, toggleMark } from '../../lib/functions';
import { useToolbar } from '../Toolbar/context/useLayout';
import './styles.css';
interface ColorPickerProps {
  defaultColor?: string;
  // color?: string,
  onChange?: (color: string, e: React.MouseEvent) => void;
}

const LIST_COLORS = colors;
const COLOR_ITEM_SIZE = 20;

const ColorPicker = (props: ColorPickerProps) => {
  const { state, updateState, slug } = useToolbar()!;

  const { defaultColor = '#000000' } = props;
  const editor = useSlate();
  const color = getColorForSelection(editor, 'color');

  return (
    <div
      className="parent-color-picker"
      id="colorSelectorPortal"
      style={{
        position: 'relative',
      }}
    >
      <span
        onClick={() => updateState(slug?.colorSelector, !state?.colorSelector)}
        style={{
          cursor: 'pointer',
          fill: color ?? defaultColor,
        }}
      >
        {Icons.COLOR_SELECTOR}
      </span>
      {/* <div
        className="color-picker-main"
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
          cursor: 'pointer',
        }}
      ></div> */}
      <div
        id="colorSelectorPortal"
        className="color-picker-content"
        style={{
          visibility: state?.colorSelector ? 'visible' : 'hidden',
          width: (COLOR_ITEM_SIZE + 10) * 8,
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          position: 'absolute',
          zIndex: 100,
          backgroundColor: 'white',
          boxShadow: `0 4px 8px 0 rgba(0,0,0,0.2)`,
          padding: '8px',
          gap: 6,
          flexWrap: 'wrap',
          left: -15,
          top: 25,
          borderRadius: '4px',
        }}
      >
        {LIST_COLORS.map(colorValue => {
          return (
            <div
              key={colorValue}
              onClick={() => {
                toggleMark(
                  editor,
                  'color',
                  colorValue == color ? null : colorValue
                );
              }}
              style={{
                backgroundColor: colorValue,
                borderRadius: colorValue == color ? '50%' : '4px',
                minWidth: COLOR_ITEM_SIZE,
                minHeight: COLOR_ITEM_SIZE,
                cursor: 'pointer',
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};
ColorPicker.defaultName = 'ColorPicker';
export default ColorPicker;
