import * as React from 'react';
import { ElementProps } from './Element';
import { MentionElement } from '../../types';
import './styles.css';
import Icons from '../../assets/icons';

const MentionContact = ({
  attributes,
  children,
  element,
  mentionContactItemRenderer,
  mentionDetailRenderer,
}: ElementProps) => {
  var el = element as MentionElement;

  return (
    <div
      {...attributes}
      contentEditable={false}
      // data-cy={`mention-${element.character?.replace(' ', '-')}`}

      className="rte-mentionWrapper"
    >
      {children}
      {mentionContactItemRenderer != null ? (
        mentionContactItemRenderer({
          id: el.id,
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
              <span>{Icons.CELL_PHONE}</span>
              <span> {el.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentionContact;
