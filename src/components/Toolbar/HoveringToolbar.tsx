import * as React from 'react';
import { useEffect, useRef, Ref } from 'react';
import { Editor, Transforms, Text, Range, NodeEntry, Node } from 'slate';
import { useFocused, useSlate } from 'slate-react';
import { RaraEditorType } from '../../types';
import { MarkerItem, Markers } from './Markers';
import { isBlockActive, toggleBlock } from '../../lib/functions';
import Icons from '../../assets/icons';
import { Portal } from '../../lib/Portal';

export const toggleFormat = (editor: RaraEditorType, format: string) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  );
};

const isFormatActive = (editor: RaraEditorType, format: string) => {
  const [match]: Generator<NodeEntry<Node>> = Editor.nodes(editor, {
    match: (n: any) => n[format] === true,
    mode: 'all',
  });
  return !!match;
};

export const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();
    el.style.opacity = '1';
    el.style.top = `${rect?.top + window?.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect?.left + window?.pageXOffset - el?.offsetWidth / 2 + rect?.width / 2
    }px`;
  });

  return (
    // <Portal>

    <Portal>
      <div className="rte-hovewring-toolbar" ref={ref as Ref<HTMLDivElement>}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Markers />
          <MarkerItem
            key="code"
            icon={Icons.CODE}
            name="Code"
            active={isBlockActive(editor, 'code')}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlock(editor, 'code');
            }}
          />
        </div>
      </div>
    </Portal>
    // </Portal>
  );
};
