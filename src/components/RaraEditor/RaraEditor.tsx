/* eslint-disable jsx-a11y/no-autofocus */
import * as React from 'react';
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Editable,
  withReact,
  ReactEditor,
  Slate,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import { createEditor, Editor, Range } from 'slate';

import { withHistory } from 'slate-history';
import {
  CustomElement,
  CustomTextElement,
  RaraEditorType,
  RaraEditorProps,
  MentionItemProps,
} from '../../types';
import { Toolbar } from '../Toolbar';
import {
  insertMention,
  withInlines,
  withMentions,
  insertMentionContact,
} from '../../lib/functions';
import {  Leaf } from '../Elements';

import './styles.css';
import { Portal } from '../../lib/Portal';
import withHtml from '../../lib/handlers/withHTML';
import { HoveringToolbar } from '../Toolbar/HoveringToolbar';

import { editerHooks, mention } from '../../utils/serializer';
import Icons from '../../assets/icons';
import Element from '../Elements/Element';

// const LIST_TYPES = ['numbered-list', 'bulleted-list']
// const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

declare module 'slate' {
  interface CustomTypes {
    Editor: RaraEditorType;
    Element: CustomElement;
    Text: CustomTextElement;
  }
}

const RaraEditor = (props: RaraEditorProps) => {
  const {
    readOnly = false,
    onCheckboxChange,
    onChange,
    mentionOptionRenderer,
    mentionContactOptionRenderer,
    onMentionQuery = [],
    onMentionContactQuery = [],
    mentionItemRenderer,
    placeholder,
    mentionContactItemRenderer,
    mentionContactDetailRenderer,
    mentionDetailRenderer,
    styles,
  } = props;

  const ref = React.useRef<HTMLInputElement>(null);
  const [target, setTarget] = React.useState<Range | null>();
  const [index, setIndex] = React.useState(0);
  const [search] = React.useState('');
  const [mentionIndicator, setMentionIndicator] = React.useState<string | null>(
    null
  );
  const [searchResults, setSearchResults] = React.useState<MentionItemProps[]>(
    []
  );

  const editor = React.useMemo(
    () =>
      withHtml(
        withMentions(withInlines(withHistory(withReact(createEditor()))))
      ),
    []
  );
  const { onDOMBeforeInput, onKeyDown, decorate, initialValue } = editerHooks({
    index,
    target,
    searchResults,
    setIndex,
    insertMention,
    insertMentionContact,
    setTarget,
    setSearchResults,
    editor,
    search,
    mentionIndicator,
    ...props,
  });

  const renderElement = React.useCallback(
    (props: any) => (
      <Element
        {...props}
        onCheckboxChange={onCheckboxChange}
        isMentionLoading={false}
        // onMentionQuery={onMentionQuery}
        mentionItemRenderer={mentionItemRenderer}
        mentionDetailRenderer={mentionDetailRenderer}
        mentionContactItemRenderer={mentionContactItemRenderer}
        mentionContactDetailRenderer={mentionContactDetailRenderer}
      />
    ),
    []
  );
  const renderLeaf = React.useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  React.useEffect(() => {
    if (target && searchResults.length > 0) {
      const el = ref.current;
      if (el) {
        const domRange = ReactEditor.toDOMRange(editor, target);
        const rect = domRange.getBoundingClientRect();
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
  }, [editor, index, JSON.stringify(searchResults), target]);

  return (
    <div className={`rte-editor ${readOnly ? 'read-only' : ''}`} style={styles}>
      <Slate
        onChange={async (change) => {
          //TO check if the values are changed or not
          const isAstChange = editor.operations.some(
            (op) => 'set_selection' !== op.type
          );
          const { selection } = editor;

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: 'word' });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
              beforeRange && Editor.string(editor, beforeRange);
            const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeMatch && afterMatch) {
              setMentionIndicator(mention?.USER_MENTION);
              setTarget(beforeRange);
              if (onMentionQuery) {
                const filterOption = onMentionQuery?.filter((e) =>
                  String(e?.label)?.includes(beforeMatch[1])
                );
                setSearchResults(filterOption);
              }

              // setSearch(beforeMatch[1])
              setIndex(0);
              return;
            }
          }

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: 'word' });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
              beforeRange && Editor.string(editor, beforeRange);
            const beforeMatch = beforeText && beforeText.match(/^#(\w+)$/);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);
            if (beforeMatch && afterMatch) {
              setMentionIndicator(mention?.CONTACT_MENTION);
              setTarget(beforeRange);
              if (onMentionContactQuery) {
                const filterOption = onMentionContactQuery?.filter((e) =>
                  String(e?.label)?.includes(beforeMatch[1])
                );
                setSearchResults(filterOption);
              }

              // setSearch(beforeMatch[1])
              setIndex(0);
              return;
            }
          }
          setTarget(null);
          if (isAstChange) {
            // Save the value to Local Storage.
            onChange && onChange(JSON.stringify(change));
          }
        }}
        editor={editor}
        value={initialValue}
      >
        {!readOnly && (
          <div style={{ display: 'flex' }}>
            <Toolbar   />
          </div>
        )}
        <Editable
          decorate={decorate}
          spellCheck
          autoFocus
          renderElement={(p: RenderElementProps) => {
            return renderElement(p);
          }}
          className={`rte-editor-body ${readOnly ? 'read-only' : ''}`}
          renderLeaf={renderLeaf}
          placeholder={placeholder ?? (readOnly ? placeholder : 'Placeholder')}
          readOnly={readOnly}
          onKeyDown={onKeyDown}
          onDOMBeforeInput={(event: InputEvent) => {
            onDOMBeforeInput(event, editor);
          }}
        />
        {target && (
          <Portal>
            <div ref={ref} className="mentionPopOver" data-cy="mentions-portal">
              {searchResults?.map((searchResultItem, i) => (
                <div
                  style={{
                    background: i === index ? '#B4D5FF' : 'transparent',
                  }}
                  key={'searchResultItem' + i}
                >
                  {mention?.CONTACT_MENTION === mentionIndicator ? (
                    <>
                      {mentionContactOptionRenderer != null ? (
                        mentionContactOptionRenderer(searchResultItem)
                      ) : (
                        <div className="mentionPopOverItem">
                          <span>{Icons.CELL_PHONE}</span>
                          <span> {searchResultItem.label}</span>{' '}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {mentionOptionRenderer != null ? (
                        mentionOptionRenderer(searchResultItem)
                      ) : (
                        <div className="mentionPopOverItem">
                          <span
                            style={{
                              backgroundColor:
                                i % 2 === 0 ? '#7eaaed' : '#5ec4db',
                            }}
                            className="mentionPoPoverAvatar"
                          >
                            {String(searchResultItem?.label)?.charAt(0)}
                          </span>
                          <span> {searchResultItem.label}</span>{' '}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </Portal>
        )}
        <HoveringToolbar />
      </Slate>
    </div>
  );
};

RaraEditor.displayName = 'RaraEditor';

export default RaraEditor;
