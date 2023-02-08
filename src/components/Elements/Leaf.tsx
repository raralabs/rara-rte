import * as React from 'react';
// import { CustomTextElement } from '../../types';
// import { ElementProps } from './Element';

// declare module 'slate-react' {
//   interface ColumnMeta<TData extends RowData, TValue> {
//     column?: ColumnDef<TData, TValue>;
//     isNumeric?: boolean;
//     width?: number | string;
//     Footer?: {
//       colspan?: number;
//       display?: 'none';
//     };
//   }
// }
// interface LeafProps {
//   attributes?: ElementProps
//   children?: React.ReactNode;
//   leaf?:CustomTextElement
//   element?:any
//   text?:CustomTextElement
// }//need to extend the leaf props to RenderLeafProps
const Leaf = ({ attributes, children, leaf }:any) => {
  if (leaf?.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf?.code) {
    children = <code>{children}</code>;
  }
  if (leaf?.italic) {
    children = <em>{children}</em>;
  }
  if (leaf?.strike) {
    children = <s>{children}</s>;
  }
  if (leaf?.underline) {
    children = <u>{children}</u>;
  }
  if (leaf?.color) {
    children = (
      <span
        style={{
          color: leaf?.color as string,
        }}
      >
        {children}
      </span>
    );
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

  return (
    <span
      {...attributes}
      {...(leaf?.highlight && { 'data-cy': 'search-highlighted' })}
      style={{
        fontWeight: leaf?.bold ? 'bold' : 'normal',
        backgroundColor: leaf?.highlight ? '#4ceb46' : '',
      }}
      {...attributes}
    >
      {children}
    </span>
  );
};

export { Leaf };
