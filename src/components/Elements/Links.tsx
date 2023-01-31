import * as React from 'react';
import { BlockQuoteElement, LinkElement } from '../../types';
interface LinkElementProps {
  attributes?: Record<string,string|boolean>;
  children?: React.ReactNode;
  element?: BlockQuoteElement | LinkElement;
}
const LinkElement = ({ attributes, children, element }: LinkElementProps) => {
  if (element && 'url' in element) {
    return (
      <a href={element.url} {...attributes}>
        {children}
      </a>
    );
  }
  return null;
};

export default LinkElement;
