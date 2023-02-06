import * as React from 'react';

interface LeafProps {
  attributes?: Record<string,string|boolean>;
  children?: React.ReactNode;
  leaf?: Record<string,string|boolean|any[]>
}//need to extend the leaf props to RenderLeafProps
const Leaf = ({ attributes, children, leaf }: LeafProps) => {
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

export { Leaf, LeafProps };
