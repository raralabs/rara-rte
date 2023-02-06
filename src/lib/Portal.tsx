import React from 'react';
import * as ReactDOM from 'react-dom';

export const Portal = ({ children }:{children:React.ReactNode}) => {
  return typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null;
};
