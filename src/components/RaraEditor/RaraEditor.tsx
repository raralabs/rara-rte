import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Editable, withReact, ReactEditor, Slate, RenderElementProps } from 'slate-react'
import {
    createEditor,

    Editor,
    Transforms,
    Range,

} from 'slate'

import { withHistory } from 'slate-history';
import { CustomElement, CustomTextElement, RaraEditorType, RaraEditorProps, MentionItemProps } from '../../types';
import { Toolbar } from '../Toolbar';
import { insertMention, withInlines, withMentions } from '../../lib/functions';
import { Element, ElementProps, Leaf, LeafProps } from '../Elements';


import './styles.css';
import { Portal } from '../../lib/Portal';
import withHtml from '../../lib/handlers/withHTML';

// const LIST_TYPES = ['numbered-list', 'bulleted-list']
// const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']


declare module 'slate' {
    interface CustomTypes {
        Editor: RaraEditorType
        Element: CustomElement
        Text: CustomTextElement
    }
}


const RaraEditor = (props: RaraEditorProps) => {
    const { readOnly = false, onCheckboxChange, onChange, isMentionLoading, mentionOptionRenderer, onMentionQuery,mentionItemRenderer,placeholder } = props;

    const ref =useRef<HTMLInputElement>(null)
    // useRef<HTMLDivElement>()// useRef<React.LegacyRef<HTMLDivElement>>

    // const [ref,setRef]=useState<HTMLDivElement>(null);
    const [target, setTarget] = useState<Range | null>()
    const [index, setIndex] = useState(0)
    // const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState<MentionItemProps[]>([]);
    const [isSearching, setIsSearching] = useState(true);

    const renderElement = useCallback((props: ElementProps) => <Element {...props}
        onCheckboxChange={onCheckboxChange}
        isMentionLoading={isMentionLoading}
        onMentionQuery={onMentionQuery}
        mentionItemRenderer={mentionItemRenderer}


    />, [])
    const renderLeaf = useCallback((props: LeafProps) => <Leaf {...props} />, [])

    const initialValue = useMemo(
        () => {
            try {
                let v=props.value;
                if(["[]","[ ]","",undefined,null].includes(v)){
                    v=undefined;
                }
                const valueArray = JSON.parse(v ?? '[{"type":"paragraph","children":[{"text":""}]}]');
                return valueArray;
            } catch (e) {
                console.error("Unparsable value provided",props.value);
                return [
                    {
                        type: 'paragraph',
                        children: [{ text: '' }],
                    },
                ]
            }
        }
        ,
        []
    )

    const editor = useMemo(() => withHtml(withMentions(withInlines(withHistory(withReact(createEditor()))))), [])

    // const chars = CHARACTERS.filter((c: string) =>
    //     c.toLowerCase().startsWith(search.toLowerCase())
    // ).slice(0, 10)
    // console.log("filtered chars", chars, target);

    const onKeyDown = useCallback(
        (event: any) => {
            if (target) {
                switch (event.key) {
                    case 'ArrowDown':
                        event.preventDefault()
                        const prevIndex = index >= searchResults.length - 1 ? 0 : index + 1
                        setIndex(prevIndex)
                        break
                    case 'ArrowUp':
                        event.preventDefault()
                        const nextIndex = index <= 0 ? searchResults.length - 1 : index - 1
                        setIndex(nextIndex)
                        break
                    case 'Tab':
                    case 'Enter':
                        event.preventDefault()
                        Transforms.select(editor, target)
                        insertMention(editor, searchResults[index]);
                        setTarget(null)
                        setSearchResults([]);
                        break
                    case 'Escape':
                        event.preventDefault()
                        setTarget(null)
                        setSearchResults([])
                        setIsSearching(false);
                        break
                }
            }
        },
        [index, JSON.stringify(searchResults), target]
    )

    useEffect(() => {
        if (target && searchResults.length > 0) {
            const el = ref.current
            if (el) {
                const domRange = ReactEditor.toDOMRange(editor, target)
                const rect = domRange.getBoundingClientRect();
                el.style.top = `${rect.top + window.pageYOffset + 24}px`
                el.style.left = `${rect.left + window.pageXOffset}px`
            }
        }
    }, [editor, index, JSON.stringify(searchResults), target])

    return <div className={`rte-editor ${readOnly?'read-only':''}`}>
        <Slate

            onChange={async (change) => {
                //TO check if the values are changed or not
                const isAstChange = editor.operations.some(
                    op => 'set_selection' !== op.type
                )
                const { selection } = editor

                if (selection && Range.isCollapsed(selection)) {
                    const [start] = Range.edges(selection)
                    const wordBefore = Editor.before(editor, start, { unit: 'word' })
                    const before = wordBefore && Editor.before(editor, wordBefore)
                    const beforeRange = before && Editor.range(editor, before, start)
                    const beforeText = beforeRange && Editor.string(editor, beforeRange)
                    const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
                    const after = Editor.after(editor, start)
                    const afterRange = Editor.range(editor, start, after)
                    const afterText = Editor.string(editor, afterRange)
                    const afterMatch = afterText.match(/^(\s|$)/)
                    console.log("BMA",beforeMatch,afterMatch);

                    if (beforeMatch && afterMatch) {
                        console.log("Matching");
                        setTarget(beforeRange)
                        setIsSearching(true);
                        if (onMentionQuery) {
                            let results = await onMentionQuery(beforeMatch[1]);
                            console.log("GOT result", results);
                            setSearchResults(results);
                            
                        }
                        setIsSearching(false);

                        // setSearch(beforeMatch[1])
                        setIndex(0)
                        return
                    }else if(searchResults.length>0){
                        setSearchResults([]);
                        setIsSearching(false);
                    }
                }

                setTarget(null)

                if (isAstChange) {
                    // Save the value to Local Storage.
                    onChange && onChange(JSON.stringify(change));
                }
            }}
            editor={editor} value={initialValue} >
            {!readOnly && <Toolbar
                items={
                    [
                        // <BlockButton key={'numbered'} format="numbered-list" label="format_list_numbered" />,
                        // <BlockButton key={'bulleted'} format="bulleted-list" label="format_list_bulleted" />,
                        // <BlockButton key={'left'} format="left" label="format_align_left" />,
                        // <BlockButton key={'center'} format="center" label="format_align_center" />,
                        // <BlockButton key={'right'} format="right" label="format_align_right" />,
                        // <BlockButton key={'justify'} format="justify" label="format_align_justify" />
                    ]}
            />
            }
            {target && (searchResults.length > 0 || isSearching) && (
                <Portal>
                    {isSearching ? <div style={{
                        top: '-9999px',
                        left: '-9999px',
                        position: 'absolute',
                        zIndex: 1,
                        padding: '3px',
                        background: 'white',
                        borderRadius: '4px',
                        boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                    }}>
                        Loading...
                    </div> :
                        <div
                            ref={ref}
                            style={{
                                top: '-9999px',
                                left: '-9999px',
                                position: 'absolute',
                                zIndex: 1,
                                padding: '3px',
                                background: 'white',
                                borderRadius: '4px',
                                boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                            }}
                            data-cy="mentions-portal"
                        >
                            {searchResults.map((searchResultItem, i) => (
                                <div
                                    key={"searchResultItem" + i}
                                    style={{
                                        padding: '1px 3px',
                                        borderRadius: '3px',
                                        background: i === index ? '#B4D5FF' : 'transparent',
                                    }}
                                >
                                    {mentionOptionRenderer != null ?
                                        mentionOptionRenderer(searchResultItem) :
                                        searchResultItem.label}
                                </div>
                            ))}
                        </div>
                    }
                </Portal>
            )}
            <Editable
                renderElement={(p: RenderElementProps) => {
                    return renderElement(p);
                }}
                
                className={`rte-editor-body ${readOnly?'read-only':''}`}
                renderLeaf={renderLeaf}
                placeholder={placeholder??(readOnly?placeholder:"Placeholder")}
                readOnly={readOnly}
                onKeyDown={onKeyDown}
            // onKeyDown={(e) => {

            //     onKeyDown(e, editor, target);
            // }}
            />
        </Slate>
    </div>


}



RaraEditor.displayName = "RaraEditor";

export default RaraEditor;

