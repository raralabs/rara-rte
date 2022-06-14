import React, { useCallback, useMemo } from 'react'
import { Editable, withReact, ReactEditor, Slate, useSlateStatic, useReadOnly } from 'slate-react'
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
import { isBlockActive } from '../../lib/functions';
// import '../../lib/CodeBlock/prism.css';
// import '../../lib/CodeBlock/prism.js';
import 'prismjs/themes/prism.css';
import Prism from 'prismjs';

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
    element?: any
}
const Element = ({ attributes, children, element }: ElementProps) => {
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
            return <CheckListItemElement attributes={attributes} children={children} element={element} />
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
            return <pre><code className='rte-pre language-javascript' {...attributes}>
                {children}
            </code></pre>;
        case 'link':
            return (
                <a href={element.url} {...attributes}>
                    {children}
                </a>
            );
        default:
            return (
                <p className='rte-paragraph' style={style} {...attributes}>
                    {children}
                </p>
            )
    }
}

interface CheckListItemElementProps {
    attributes?: any,
    children?: any,
    element?: any
}
const CheckListItemElement = ({ attributes, children, element }: CheckListItemElementProps) => {
    const editor = useSlateStatic()
    const readOnly = useReadOnly()
    const { checked } = element
    return (
        <div
            {...attributes}
            style={{
                display: 'flex',
                alignItems: 'center'
            }}
        // className={css`
        //   display: flex;
        //   flex-direction: row;
        //   align-items: center;
        //   & + & {
        //     margin-top: 0;
        //   }
        // `}
        >
            <span
                contentEditable={false}
                style={{
                    marginRight: '0.75em'
                }}
            >
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={event => {
                        const path = ReactEditor.findPath(editor, element)
                        const newProperties: Partial<SlateElement> = {
                            checked: event.target.checked,
                        }
                        Transforms.setNodes(editor, newProperties, { at: path })
                    }}
                />
            </span>
            <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                style={{
                    flex: 1,
                    opacity: checked ? 0.666 : 1,
                    textDecoration: !checked ? 'none' : 'line-through',

                }}
            //   className={css`
            //     flex: 1;
            //     opacity: ${checked ? 0.666 : 1};
            //     text-decoration: ${!checked ? 'none' : 'line-through'};
            //     &:focus {
            //       outline: none;
            //     }
            //   `}
            >
                {children}
            </span>
        </div>
    )
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
        console.log("LEAF color", leaf);
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
    const renderElement = useCallback((props: ElementProps) => <Element {...props} />, [])
    const renderLeaf = useCallback((props: LeafProps) => <Leaf {...props} />, [])

    // const editor = useMemo(() => withReact(createEditor()), [])
    const initialValue = useMemo(
        () =>
            localStorage.getItem('content') ?
                JSON.parse(localStorage.getItem('content') ?? "[]") : [
                    {
                        type: 'paragraph',
                        children: [{ text: 'A line of text in a paragraph.' }],
                    },
                ],
        []
    )
    // const initialValue: Descendant[] = [
    //     {
    //         type: 'paragraph',
    //         children: [{ text: 'A line of text in a paragraph.' }],
    //     },
    // ]

    const editor = useMemo(() => withHistory(withReact(createEditor())), [])


    return <div>

        <h1>Rara Editor {props.value}</h1>
        <Slate

            onChange={change => {
                //TO check if the values are changed or not
                const isAstChange = editor.operations.some(
                    op => 'set_selection' !== op.type
                )
                if (isAstChange) {
                    // Save the value to Local Storage.
                    console.log("saving data", change);
                    localStorage.setItem('content', JSON.stringify(change))
                    console.log("Serialized Value", serializeSlateData(change))
                }
            }}
            editor={editor} value={initialValue} >
            {/* <Toolbar /> */}
            <Toolbar
                items={
                    [
                        // <ColorPickerButton
                        // />,
                        // <Divider/>,
                        // <Markers />,
                        // <Divider/>,
                        // <input type="color" id="colorpicker" onChange={(e)=>{
                        //     console.log(e.target.value);
                        //     toggleMark(editor,'color',e.target.value);
                        // }}></input>,
                        // <MarkButton key={'color1'} format="color" label="red" value={'red'} />,
                        // <MarkButton key={'bold'} format="bold" label="format_bold" />,
                        // <MarkButton key={'italic'} format="italic" label="format_italic" />,
                        // <MarkButton key={'underline'} format="underline" label="format_underlined" />,
                        // <MarkButton key={'code'} format="code" label="code" />,
                        // <MarkButton key={'heading1'} format="level" label="looks_one"  value={1}/>,
                        // <MarkButton key={'heading2'} format="level" label="looks_one"  value={2}/>,
                        // <BlockButton key={'heading2'} format="heading-two" label="looks_two" />,
                        // <BlockButton key={'block'} format="block-quote" label="format_quote" />,
                        // <BlockButton key={'numbered'} format="numbered-list" label="format_list_numbered" />,
                        // <BlockButton key={'bulleted'} format="bulleted-list" label="format_list_bulleted" />,
                        // <BlockButton key={'left'} format="left" label="format_align_left" />,
                        // <BlockButton key={'center'} format="center" label="format_align_center" />,
                        // <BlockButton key={'right'} format="right" label="format_align_right" />,
                        // <BlockButton key={'justify'} format="justify" label="format_align_justify" />
                    ]}
            />
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Placeholder"
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
                        console.log("Metakey Enter", e, editor);
                        checkListAndRemoveIfExist(editor);
                        // const marks = Editor.marks(editor)
                        // console.log(marks);
                    }
                    // let's make the current text bold if the user holds command and hits "b"
                    if (e.metaKey && e.key === 'b') {
                        e.preventDefault();
                        editor.addMark('bold', true);
                    }
                    if (e.metaKey && e.key === 'i') {
                        e.preventDefault();

                        editor.addMark('italic', true);
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