import * as React from 'react';
import { useSlate } from 'slate-react';
import Icons from '../../assets/icons';
import {
  insertLink,
  isBlockActive,
  toggleBlock,
  unwrapLink,
} from '../../lib/functions';
import { ColorPicker } from '../ColorPicker';
// import Search from '../Elements/search';
import ContextProvider from './context/useLayout';
import { Divider } from './Divider';
import { Headings } from './Headings';
import { ListsMarkers } from './Lists';
import { MarkerItem, Markers } from './Markers';
import { TextAlignMarkers } from './TextAlignMarkers';
import { ElementIgnorType } from '../../types';

// interface ToolbarProps {
//   items: any[];
//   onSearch?: (e: string) => void;
// }
export const Toolbar = ({ ignorList }: { ignorList?: ElementIgnorType[] }) => {
  const editor = useSlate();
  // console.log(editor);
  return (
    <ContextProvider>
      <div className="rte-toolbar">
        {!ignorList?.includes('color') &&
          <>
            <ColorPicker />
            <Divider />
          </>}

        <Markers />
        <Divider />
        {!ignorList?.includes('block-quote') && <><MarkerItem
          key={'block-quote'}
          icon={Icons.QUOTE}
          name="Block Quot"
          onMouseDown={e => {
            e.preventDefault();
            toggleBlock(editor, 'block-quote');
          }}
          active={isBlockActive(editor, 'block-quote')}
        />
          <Divider />
        </>}
        {!ignorList?.includes('heading') && <><Headings />
          <Divider />
        </>}
        {!ignorList?.includes('alignMarker') && <TextAlignMarkers />}
        {!ignorList?.includes('listMarker') && <><ListsMarkers />
          <Divider />
        </>}
        {!ignorList?.includes('code') && <> <MarkerItem
          key={'code'}
          icon={Icons.CODE}
          name="Code"
          active={isBlockActive(editor, 'code')}
          onMouseDown={e => {
            e.preventDefault();
            toggleBlock(editor, 'code');
          }}
        />
          <Divider />
        </>}
        {!ignorList?.includes('check-list-item') && <><MarkerItem
          key={'check-list-item'}
          icon={Icons.CLIST}
          name="Checklist"
          active={isBlockActive(editor, 'check-list-item')}
          onMouseDown={e => {
            e.preventDefault();
            toggleBlock(editor, 'check-list-item');
          }}
        />
          <Divider />
        </>}
        {ignorList?.includes('link') && <> <MarkerItem
          icon={Icons.LINK}
          key="link"
          name="Link"
          active={isBlockActive(editor, 'link')}
          onMouseDown={e => {
            e.preventDefault();
            if (!isBlockActive(editor, 'link')) {
              const url = window.prompt('Enter the URL of the link:');
              if (!url) return;
              insertLink(editor, url);
            } else {
              unwrapLink(editor);
            }
          }}
        />
          <Divider />
        </>}
        {/* <Search onChange={onSearch} /> */}
      </div>
    </ContextProvider >
  );
};
