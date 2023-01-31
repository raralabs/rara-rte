import * as React from 'react';
import { ElementProps } from './Element';
import {  MentionItemProps } from '../../types';
import './styles.css';

const Mention = ({
  attributes,
  children,
  element,
  mentionItemRenderer,
  mentionDetailRenderer,
}: ElementProps) => {
  var el = element as MentionItemProps;

  return (
    <div
      {...attributes}
      contentEditable={false}
      // data-cy={`mention-${element.character?.replace(' ', '-')}`}

      className="rte-mentionWrapper"
      style={{ padding: 0, margin: 0 }}
    >
      {children}
      {mentionItemRenderer != null ? (
        mentionItemRenderer({
          id: el?.id as string,
          label: el.label ?? el.id,
          metaData: el.metaData,
        })
      ) : (
        <>
          <span
            style={{
              cursor: 'pointer',
              color: '#1A6CAA',
            }}
          >
            {el.label}
          </span>
          <br />
        </>
      )}
      <div className="mentionDetailPopOver" data-cy="mentions-portal">
        <div>
          {mentionDetailRenderer != null ? (
            mentionDetailRenderer({
              id: el.id,
              label: el.label ?? el.id,
              metaData: el.metaData,
            })
          ) : (
            <div className="mentionDetailPopOverItem">
              <span className="mentionDetailPopOverAvatar">
                {(typeof el.label === 'string') && el?.label?.charAt(0)}
              </span>
              <span> {el.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mention;
