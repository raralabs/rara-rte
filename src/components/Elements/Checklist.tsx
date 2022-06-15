
import React from 'react';
import { ReactEditor, useReadOnly, useSlateStatic } from 'slate-react';
import {
    Transforms,
    Element as SlateElement,

} from 'slate'
import { serializeSlateData } from '../../utils/serializer';
interface CheckListItemElementProps {
    attributes?: any,
    children?: any,
    element?: any,
    onCheckboxChange?: (checked: boolean, value: string) => void
}
const CheckListItemElement = ({ attributes, children, element, onCheckboxChange }: CheckListItemElementProps) => {
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
                        // console.log("PATH",element,path,editor.children,serializeSlateData(element.children));

                        //sends trigger of checklist change for text value
                        onCheckboxChange && onCheckboxChange(event.target.checked, serializeSlateData(element.children))
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

export default CheckListItemElement;