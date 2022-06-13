import React, { useCallback, useMemo } from 'react'
import { Editable, withReact, ReactEditor, Slate, useSlate } from 'slate-react'
import {
    createEditor,

    Editor,
    Transforms,
    Element as SlateElement,

} from 'slate'
import { withHistory } from 'slate-history';
import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ChecklistElement, ColoredElement, CustomElement, CustomTextElement, ParagraphElement, RaraEditorProps } from '../../types';
import { serializeSlateData } from '../../utils/serializer';
import { IconButton } from '../IconButton';
import { Toolbar } from '../Toolbar';
import './styles.css';
import { isMarkActive, toggleMark,isBlockActive, toggleBlock } from '../../lib/functions';


// const HOTKEYS = {
//     'mod+b': 'bold',
//     'mod+i': 'italic',
//     'mod+u': 'underline',
//     'mod+`': 'code',
// };

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
            console.log(attributes,children,element);
            return (
                <span style={{...style,fontSize:30,fontWeight:'bold'}} {...attributes}>
                    {children}
                </span>
            )
        case 'heading-two':
            return (
                <h2 style={style} {...attributes}>
                    {children}
                </h2>
            )
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
            return <pre {...attributes}>{children}</pre>;
        case 'link':
            return (
                <a href={element.url} {...attributes}>
                    {children}
                </a>
            );
        default:
            return (
                <p style={style} {...attributes}>
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
const FONT_SIZES=[0,32,24,20,16];
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
    if (leaf.level) {
        children = <span style={{
            fontSize: FONT_SIZES[leaf.level]??8,
            fontWeight:'bold',

        }}>{children}</span>
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

    const toolBarItems = [
        {
            name: "Bold",
            type: 'mark',
            format: ''
        }
    ]

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



interface MarkButtonProps {
    format: string,
    label: string,
    value?: any
}

const MarkButton = ({ format, label, value }: MarkButtonProps) => {
    const editor = useSlate()
    return (
        <IconButton
            name={label}
            active={isMarkActive(editor, format)}
            onMouseDown={(event: any) => {
                event.preventDefault()
                toggleMark(editor, format, value)
            }}
        />
    )
}
interface BlockButtonProps {
    format: string,
    label: string
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



const BlockButton = ({ format, label }: BlockButtonProps) => {
    const editor = useSlate()
    return (
        <IconButton
            name={label}
            active={isBlockActive(
                editor,
                format,
                TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
            )}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        />
    )
}

RaraEditor.displayName = "RaraEditor";

export default RaraEditor;