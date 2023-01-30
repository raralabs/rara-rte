import * as React from 'react';
import { useSlate } from 'slate-react';
import Icons from '../../assets/icons';
import { isBlockActive, toggleBlock } from '../../lib/functions';
import { useToolbar } from './context/useLayout';
import { MarkerItem } from './Markers';
import './styles.css';
interface HeadingsProps {}

const HEADINGS_LIST: {
  [index: string]: {
    icon: string;
    name: string;
    label: string;
    fontSize: string;
  };
} = {
  'heading-one': {
    icon: 'heading.svg',
    name: 'Heading 1',
    label: 'H1',
    fontSize: '2em',
  },
  'heading-two': {
    icon: 'heading.svg',
    name: 'Heading 2',
    label: 'H2',
    fontSize: '1.5em',
  },
  'heading-three': {
    icon: 'heading.svg',
    name: 'Heading 3',
    label: 'H3',
    fontSize: '1.17em',
  },
  'heading-four': {
    icon: 'heading.svg',
    name: 'Heading 4',
    label: 'H4',
    fontSize: '1em',
  },
  'heading-five': {
    icon: 'heading.svg',
    name: 'Heading 5',
    label: 'H5',
    fontSize: '0.83em',
  },
  'heading-six': {
    icon: 'heading.svg',
    name: 'Heading 6',
    label: 'H6',
    fontSize: '0.67em',
  },
};

export const Headings = (props: HeadingsProps) => {
  const { state, updateState, slug } = useToolbar()!;

  const [isHeaderActive, setIsHeaderActive] = React.useState<boolean>(false);
  const {} = props;
  const editor = useSlate();
  return (
    <div id="headingSelectorPortal" className="parent-heading-picker">
      <div
        onClick={() =>
          updateState(slug?.headingSelector, !state?.headingSelector)
        }
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <MarkerItem
          onMouseDown={e => {
            e.preventDefault();
          }}
          icon={Icons.HEADING}
          active={isHeaderActive || !!state?.headingSelector}
          name="Heading"
        />
        <span
          style={{
            filter:
              state?.headingSelector || isHeaderActive
                ? 'invert(40%) sepia(58%) saturate(2609%) hue-rotate(320deg) brightness(96%) contrast(94%)'
                : 'invert(58%) sepia(6%) saturate(0%) hue-rotate(196deg) brightness(103%) contrast(86%)',
          }}
        >
          {state?.headingSelector ? Icons.UP_ARROW : Icons.DOWN_ARROW}
        </span>
      </div>
      <div
        className="heading-picker-content"
        style={{
          visibility: state?.headingSelector ? 'visible' : 'hidden',
        }}
      >
        {Object.keys(HEADINGS_LIST).map(headingKey => {
          const headingItem = HEADINGS_LIST[headingKey];
          return (
            <div
              key={headingKey}
              className="picker-items"
              style={{
                fontWeight: 'bold',
                fontSize: headingItem.fontSize,
                color: isBlockActive(editor, headingKey) ? ' #ef476f' : 'gray',
              }}
              onClick={e => {
                e.preventDefault();
                setIsHeaderActive(!isBlockActive(editor, headingKey));
                toggleBlock(editor, headingKey);
              }}
            >
              {headingItem.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};
