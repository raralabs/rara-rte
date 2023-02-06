import * as React from 'react';
import { useSlate } from 'slate-react';
import Icons from '../../assets/icons';
import { IFormat, isMarkActive, toggleMark } from '../../lib/functions';
import './styles.css';

// const bold=require('../../assets/bold.svg');
// import {ReactComponent as ReactLogo} from '../../assets/bold.svg';
interface MarkerProps {}

export const Markers = ({}: MarkerProps) => {
  const options:{format:keyof IFormat,icon:JSX.Element,name:string}[] = [
    {
      format: 'bold',
      icon: Icons.BOLD,
      // iconComp:bold,
      name: 'Bold',
    },
    {
      format: 'italic',
      icon: Icons.ITALIC,
      name: 'Italic',
    },
    {
      format: 'underline',
      icon: Icons.UNDERLINE,
      name: 'Underline',
    },
    {
      format: 'strike',
      icon: Icons.STRIKE,
      name: 'Strike Through',
    },
  ];
  const editor = useSlate();
  return (
    <div className="rte-marker-list" style={{}}>
      {options.map(markerItem => {
        return (
          <MarkerItem
            key={markerItem.format}
            name={markerItem.name}
            active={isMarkActive(editor, markerItem.format)}
            icon={markerItem.icon}
            onMouseDown={e => {
              e.preventDefault();
              toggleMark(editor, markerItem.format);
            }}
          />
        );
      })}
    </div>
  );
};

interface MarkerItemProps {
  name: string;
  active: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  label?: string;
}

export const MarkerItem = (props: MarkerItemProps) => {
  const { onMouseDown, active, icon, name } = props ?? {};
  return (
    <div
      className={`rte-marker-item rte-toolbar-btn ${active ? 'active' : ''}`}
      onMouseDown={onMouseDown}
      title={name}
      style={{
        cursor: 'pointer',
      }}
    >
      {icon}
      {/* {icon ?
            <img src={require('../../assets/' + icon)} alt={name} /> : label} */}
    </div>
  );
};
