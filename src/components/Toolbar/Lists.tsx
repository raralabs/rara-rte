import * as React from 'react';
import { useSlate } from 'slate-react';
import Icons from '../../assets/icons';
import { isBlockActive, toggleBlock } from '../../lib/functions';
import { useToolbar } from './context/useLayout';
import { MarkerItem } from './Markers';

interface ListsMarkerProps {}

export const ListsMarkers = ({}: ListsMarkerProps) => {
  const { state, updateState, slug } = useToolbar()!;

  const [isActive, setIsActive] = React.useState<boolean>(false);
  const options = [
    {
      format: 'bulleted-list',
      icon: Icons.UN_ORDERED_LIST,
      // iconComp:bold,
      name: 'Bulleted list',
    },
    {
      format: 'numbered-list',
      icon: Icons.ORDERED_LIST,
      name: 'Numbered list',
    },
  ];
  const editor = useSlate();
  return (
    <div id="listSelectorPortal" style={{ position: 'relative' }}>
      <div
        onClick={() => updateState(slug?.listSelector, !state?.listSelector)}
        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        <MarkerItem
          onMouseDown={e => {
            e.preventDefault();
          }}
          icon={Icons.UN_ORDERED_LIST}
          active={isActive || !!state?.listSelector}
          name="Heading"
        />
        <div
          style={{
            filter:
              state?.listSelector || isActive
                ? 'invert(40%) sepia(58%) saturate(2609%) hue-rotate(320deg) brightness(96%) contrast(94%)'
                : 'invert(58%) sepia(6%) saturate(0%) hue-rotate(196deg) brightness(103%) contrast(86%)',
          }}
        >
          {state?.listSelector ? Icons.UP_ARROW : Icons.DOWN_ARROW}
        </div>
      </div>
      <div
        className="list-picker-content "
        style={{
          visibility: state?.listSelector ? 'visible' : 'hidden',
        }}
      >
        {options.map(markerItem => {
          return (
            <div
              key={markerItem.name}
              className="picker-items"
              onClick={e => {
                e.preventDefault();
                toggleBlock(editor, markerItem.format);
                setIsActive(isBlockActive(editor, markerItem.format));
              }}
              style={{
                color: isBlockActive(editor, markerItem.format)
                  ? ' #ef476f'
                  : 'gray',
              }}
            >
              <div>{markerItem.name}</div>
              <MarkerItem
                key={markerItem.format}
                name={markerItem.name}
                active={isBlockActive(editor, markerItem.format)}
                icon={markerItem.icon}
                onMouseDown={e => {
                  e.preventDefault();
                  toggleBlock(editor, markerItem.format);
                  setIsActive(isBlockActive(editor, markerItem.format));
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
