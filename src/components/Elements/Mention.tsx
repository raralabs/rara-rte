import * as React from 'react';
import { ElementProps } from './Element';
import { MentionElement } from '../../types';

const Mention = ({
  attributes,
  children,
  element,
  mentionItemRenderer,
}: ElementProps) => {
  var el = element as MentionElement;

  return (
    <span
      {...attributes}
      contentEditable={false}
      // data-cy={`mention-${element.character?.replace(' ', '-')}`}
      style={{
        // padding: '3px 3px 2px',
        margin: '0 1px',
        verticalAlign: 'baseline',
        display: 'inline-block',
        // borderRadius: '4px',
        // backgroundColor: '#eee',
      }}
    >
      {children}
      {mentionItemRenderer != null ? (
        mentionItemRenderer({
          id: el.id,
          label: el.label ?? el.id,
          metaData: el.metaData,
        })
      ) : (
        <span
          style={{
            color: '#1A6CAA',
          }}
        >
          {el.label}
        </span>
      )}
    </span>
  );
};

export default Mention;
