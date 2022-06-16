import React, { useCallback, useMemo } from 'react'
import { Editable, withReact, ReactEditor, Slate, useSlateStatic, useReadOnly, RenderElementProps } from 'slate-react'
import {
    createEditor,

    Editor,
    Transforms,
    Element as SlateElement,

} from 'slate'
import { withHistory } from 'slate-history';
import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { CustomElement, CustomTextElement, RaraEditorProps } from '../../types';
import { serializeSlateData } from '../../utils/serializer';
import { Toolbar } from '../Toolbar';
import './styles.css';
import { isBlockActive, toggleMark, withInlines } from '../../lib/functions';
// import '../../lib/CodeBlock/prism.css';
// import '../../lib/CodeBlock/prism.js';
// import 'prismjs/themes/prism.css';
import { CheckListItemElement, LinkElement } from '../Elements';

// const HOTKEYS = {
//     'mod+b': 'bold',
//     'mod+i': 'italic',
//     'mod+u': 'underline',
//     'mod+`': 'code',
// };
// Prism.highlightAll();

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

interface ElementProps {
    attributes?: any,
    children?: any,
    element?: any,
    onCheckboxChange?: (checked: boolean, value: string) => void
}
const Element = ({ attributes, children, element, onCheckboxChange }: ElementProps) => {
    const style = { textAlign: element.align }
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            )
        case 'bulleted-list':
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            )
        case 'heading-one':
            return (
                <h1 className='rte-heading-one' style={{ ...style }} {...attributes}>
                    {children}
                </h1>
            )
        case 'heading-two':
            return (
                <h2 className='rte-heading-two' style={{ ...style }} {...attributes}>
                    {children}
                </h2>
            )
        case 'heading-three':
            return (
                <h3 className='rte-heading-three' style={{ ...style }} {...attributes}>
                    {children}
                </h3>
            )
        case 'heading-four':
            return (
                <h4 className='rte-heading-four' style={{ ...style }} {...attributes}>
                    {children}
                </h4>
            )
        case 'heading-five':
            return (
                <h5 className='rte-heading-five' style={{ ...style }} {...attributes}>
                    {children}
                </h5>
            )
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            )
        case 'check-list-item':
            return <CheckListItemElement
                onCheckboxChange={onCheckboxChange}
                attributes={attributes} children={children} element={element} />
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            )
        case 'numbered-list':
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            )
        case 'code':
            return <pre className='rte-pre'{...attributes}>
                {children}
            </pre>;
        case 'link':
            return <LinkElement attributes={attributes} children={children} element={element} />
        default:
            return (
                <p className='rte-paragraph' style={style} {...attributes}>
                    {children}
                </p>
            )
    }
}

interface LeafProps {
    attributes?: any,
    children?: any,
    leaf?: any
}
// const FONT_SIZES = [0, 32, 24, 20, 16];
const Leaf = ({ attributes, children, leaf }: LeafProps) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }
    if (leaf.code) {
        children = <code>{children}</code>
    }
    if (leaf.italic) {
        children = <em>{children}</em>
    }
    if (leaf.strike) {
        children = <s>{children}</s>
    }
    if (leaf.underline) {
        children = <u>{children}</u>
    }
    if (leaf.color) {
        children = <span style={{
            color: leaf.color
        }}>{children}</span>
    }
    // if (leaf.placeholder) {
    //     return (
    //         <>
    //             {/* <DefaultLeaf {...props} /> */}
    //             <DefaultLeaf {...attributes}>{children}</DefaultLeaf>
    //             <span
    //                 style={{ opacity: 0.3, position: "absolute", bottom:0 }}
    //                 contentEditable={false}
    //             >
    //                 Type / to open menu
    //             </span>
    //         </>
    //     );
    // }

    return <span {...attributes}>{children}</span>
}



export type HeadingElement = {
    type?: 'heading'
    level?: number
    children: CustomTextElement[]
}

// enum formatType {
//     paragraph = 'paragraph',
//     heading = 'heading',
//     listItem = 'list-item',
//     bold = 'bod'
//   }

//  ParagraphElement | HeadingElement
// type CustomText = { text: string; bold?: true, italic?: true };

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
        Element: CustomElement
        Text: CustomTextElement
    }
}







const RaraEditor = (props: RaraEditorProps) => {
    const { readOnly = false, onCheckboxChange,onChange} = props;
    const renderElement = useCallback((props: ElementProps) => <Element {...props} onCheckboxChange={onCheckboxChange} />, [])
    const renderLeaf = useCallback((props: LeafProps) => <Leaf {...props} />, [])

    // const editor = useMemo(() => withReact(createEditor()), [])
    const initialValue = useMemo(
        () => {
            try {
                const valueArray = JSON.parse(props.value ?? '[{"type":"paragraph","children":[{"text":""}]}]');
                return valueArray;
            } catch (e) {
                console.error("Unparsable value provided", props.value);
                return [
                    {
                        type: 'paragraph',
                        children: [{ text: '' }],
                    },
                ]
            }
            return localStorage.getItem('content') ?
                JSON.parse(localStorage.getItem('content') ?? "[]") : [
                    {
                        type: 'paragraph',
                        children: [{ text: 'A line of text in a paragraph.' }],
                    },
                ]
        }
        ,
        []
    )
    // const initialValue: Descendant[] = [
    //     {
    //         type: 'paragraph',
    //         children: [{ text: 'A line of text in a paragraph.' }],
    //     },
    // ]

    const editor = useMemo(() => withInlines(withHistory(withReact(createEditor()))), [])


    return <div className='rte-editor'>
        <Slate

            onChange={change => {
                //TO check if the values are changed or not
                const isAstChange = editor.operations.some(
                    op => 'set_selection' !== op.type
                )
                if (isAstChange) {
                    // Save the value to Local Storage.
                    onChange&&onChange(JSON.stringify(change));
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
            <Editable
                renderElement={(p: RenderElementProps) => {
                    return renderElement(p);
                }}
                className='rte-editor-body'
                renderLeaf={renderLeaf}
                placeholder="Placeholder"
                readOnly={readOnly}
                // spellCheck
                // autoFocus
                // decorate={([node, path]) => {
                //     //TODO handle this properly later
                //     if (editor.selection != null) {
                //         if (
                //             !Editor.isEditor(node) &&
                //             Editor.string(editor, [path[0]]) === "" &&
                //             Range.includes(editor.selection, path) &&
                //             Range.isCollapsed(editor.selection)
                //         ) {
                //             return [
                //                 {
                //                     ...editor.selection,
                //                     placeholder: true,
                //                 },
                //             ];
                //         }
                //     }
                //     return [];
                // }}
                onKeyDown={(e) => {
                    //metaKey to track Cmd of mac,ALT of window,  *** of linux keyboard
                    if (e.key === 'Enter' && e.metaKey) {
                        checkListAndRemoveIfExist(editor);
                        // const marks = Editor.marks(editor)
                        // console.log(marks);
                    }
                    if (e.metaKey && e.key === 'b') {
                        e.preventDefault();
                        toggleMark(editor,'bold');
                    }
                    if (e.metaKey && e.key === 'i') {
                        e.preventDefault();
                        toggleMark(editor,'italic');
                    }
                    if (e.metaKey && e.key === 'u') {
                        e.preventDefault();
                        toggleMark(editor,'underline');
                    }
                }}
            // onKeyDown={event => {
            //    for (const hotkey in HOTKEYS) {
            //      if (isHotkey(hotkey, event as any)) {
            //        event.preventDefault()
            //        const mark = HOTKEYS[hotkey]
            //        toggleMark(editor, mark)
            //      }
            //    }
            // }}
            />
        </Slate>
    </div>
}





const checkListAndRemoveIfExist = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    LIST_TYPES.map((format: any) => {
        const isActive = isBlockActive(
            editor,
            format,
        )
        if (isActive) {
            Transforms.unwrapNodes(editor, {
                match: n =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    n.type != null &&
                    LIST_TYPES.includes(n.type) &&
                    // n.type == 'paragraph' &&
                    !TEXT_ALIGN_TYPES.includes(format),
                split: true,
            });
            const block: CustomElement = { type: 'paragraph', children: [] }
            Transforms.wrapNodes(editor, block)
        }

    });

    return;
    LIST_TYPES.map((format: any) => {
        const isActive = isBlockActive(
            editor,
            format,
        )
        console.log("Is active", format, isActive);
        const isList = true;

        Transforms.unwrapNodes(editor, {
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type != null &&
                LIST_TYPES.includes(n.type) &&
                // n.type == 'paragraph' &&
                !TEXT_ALIGN_TYPES.includes(format),
            split: true,
        })
        let newProperties: Partial<SlateElement>
        if (TEXT_ALIGN_TYPES.includes(format)) {
            newProperties = {
                align: isActive ? undefined : format,
            }
        } else {
            newProperties = {
                type: isActive ? 'paragraph' : isList ? 'list-item' : format,
            }
        }
        Transforms.setNodes<SlateElement>(editor, newProperties)

        // if (!isActive && isList) {
        //     const block: CustomElement = { type: format, children: [] }
        //     Transforms.wrapNodes(editor, block)
        // }

    })
}





RaraEditor.displayName = "RaraEditor";

export default RaraEditor;