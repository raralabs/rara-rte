import * as React from 'react';

interface DividerProps {
  type?: 'vertical' | 'horizontal';
  width?: string;
  height?: string;
}

export const Divider = (props: DividerProps) => {
  const { type = 'horizontal', width, height } = props;
  const defaultSizePercentage = '80%';
  return (
    <div
      style={{
        height: type == 'vertical' ? height ?? 2 : height ?? defaultSizePercentage,
        width: type == 'horizontal' ? width ?? 2 : width ?? defaultSizePercentage,
        backgroundColor: '#959595',
      }}
    ></div>
  );
};
