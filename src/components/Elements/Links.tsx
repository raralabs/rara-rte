import * as React from 'react';
import { LinkElement } from '../../types';
interface LinkElementProps {
  attributes?: any;
  children?: React.ReactNode;
  element?: LinkElement;
}
const LinkElement = ({ attributes, children, element }: LinkElementProps) => {
  return (
    <a href={element?.url} {...attributes}>
      {children}
    </a>
  );
};

export default LinkElement;
