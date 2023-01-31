import * as React from 'react';
import {
  BlockQuoteElement,
  LinkElement as LinkElementprops,
} from '../../types';
interface LinkElementProps {
  attributes?: Record<string, string | boolean>;
  children?: React.ReactNode;
  element?: BlockQuoteElement | LinkElementprops;
}
const LinkElement = ({ attributes, children, element }: LinkElementProps) => {
  if (element && 'url' in element) {
    return (
      <a href={element.url} {...attributes} target="_blank">
        {children}
      </a>
    );
  }
  return null;
};

export default LinkElement;
