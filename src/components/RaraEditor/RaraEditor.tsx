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
import { CustomElement, CustomTextElement, RaraEditorType, RaraEditorProps } from '../../types';
import { serializeSlateData } from '../../utils/serializer';
import { Toolbar } from '../Toolbar';
import { isBlockActive, toggleBlock, toggleMark, withInlines } from '../../lib/functions';
import { Element, ElementProps, Leaf, LeafProps } from '../Elements';


import './styles.css';
import { onKeyDown } from '../../lib/handlers';

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']


declare module 'slate' {
    interface CustomTypes {
        Editor: RaraEditorType
        Element: CustomElement
        Text: CustomTextElement
    }
}


const RaraEditor = (props: RaraEditorProps) => {
    const { readOnly = false, onCheckboxChange, onChange } = props;
    const renderElement = useCallback((props: ElementProps) => <Element {...props} onCheckboxChange={onCheckboxChange} />, [])
    const renderLeaf = useCallback((props: LeafProps) => <Leaf {...props} />, [])

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
        }
        ,
        []
    )

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
            <Editable
                renderElement={(p: RenderElementProps) => {
                    return renderElement(p);
                }}
                className='rte-editor-body'
                renderLeaf={renderLeaf}
                placeholder="Placeholder"
                readOnly={readOnly}
                onKeyDown={(e) => {
                    onKeyDown(e, editor);
                }}
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