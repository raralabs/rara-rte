import * as React from 'react';
import { useSlate } from 'slate-react';
import Icons from '../../assets/icons';
import { isBlockActive, toggleBlock } from '../../lib/functions';
import { useToolbar } from './context/useLayout';
import { MarkerItem } from './Markers';

interface TextAlignMarkerProps {}

export const TextAlignMarkers = ({}: TextAlignMarkerProps) => {
  const { state, updateState, slug } = useToolbar()!;

  const [isActive, setIsActive] = React.useState<boolean>(false);
  const options = [
    {
      format: 'left',
      icon: Icons.ALIGN_LEFT,
      // iconComp:bold,
      name: 'Left',
    },
    {
      format: 'center',
      icon: Icons.ALIGN_CENTER,
      name: 'Center',
    },
    {
      format: 'right',
      icon: Icons.ALIGN_RIGHT,
      name: 'Right',
    },
    {
      format: 'justify',
      icon: Icons.ALIGN_JUSTIFY,
      name: 'Justify',
    },
  ];
  const editor = useSlate();
  return (
    <div id="alignSelectorPortal" style={{ position: 'relative' }}>
      <div
        onClick={() => updateState(slug?.alignSelector, !state?.alignSelector)}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          gap: '2px',
        }}
      >
        <MarkerItem
          onMouseDown={e => {
            e.preventDefault();
          }}
          icon={Icons.ALIGNMENT}
          active={isActive || state?.alignSelector}
          name="Heading"
        />
        <div
          style={{
            filter:
              state?.alignSelector || isActive
                ? 'invert(40%) sepia(58%) saturate(2609%) hue-rotate(320deg) brightness(96%) contrast(94%)'
                : 'invert(58%) sepia(6%) saturate(0%) hue-rotate(196deg) brightness(103%) contrast(86%)',
          }}
        >
          {state?.alignSelector ? Icons.UP_ARROW : Icons.DOWN_ARROW}
        </div>
      </div>
      <div
        className="align-picker-content"
        style={{
          visibility: state?.alignSelector ? 'visible' : 'hidden',
        }}
      >
        {options.map(markerItem => {
          return (
            <div
              key={markerItem.name}
              onClick={e => {
                e.preventDefault();
                toggleBlock(editor, markerItem.format);
                setIsActive(isBlockActive(editor, markerItem.format, 'align'));
              }}
              className="picker-items"
              style={{
                color: isBlockActive(editor, markerItem.format, 'align')
                  ? ' #ef476f'
                  : 'gray',
              }}
            >
              <div>{markerItem.name}</div>
              <MarkerItem
                key={markerItem.format}
                name={markerItem.name}
                active={isBlockActive(editor, markerItem.format, 'align')}
                icon={markerItem.icon}
                onMouseDown={e => {
                  e.preventDefault();
                  toggleBlock(editor, markerItem.format);
                  setIsActive(
                    isBlockActive(editor, markerItem.format, 'align')
                  );
                }}
              />
            </div>
          );
        })}
      </div>
      {/* {options.map((markerItem) => {
        return (
          <MarkerItem
            key={markerItem.format}
            name={markerItem.name}
            active={isBlockActive(editor, markerItem.format, 'align')}
            icon={markerItem.icon}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlock(editor, markerItem.format);
            }}
          />
        );
      })} */}
    </div>
  );
};
