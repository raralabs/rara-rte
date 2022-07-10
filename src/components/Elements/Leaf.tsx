import React from 'react';


interface LeafProps {
    attributes?: any,
    children?: any,
    leaf?: any
}
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

export {Leaf,LeafProps}