import * as React from 'react';
import Icons from '../../assets/icons';
import { useToolbar } from '../Toolbar/context/useLayout';
import './styles.css';
interface ColorPickerProps {
  onChange: (e: string) => void;
}

const Search = (props: ColorPickerProps) => {
  const { state, updateState, slug } = useToolbar()!;
  const { onChange } = props;

  return (
    <div
      className="parent-search"
      style={{
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => {
        updateState(slug?.search, !state?.search);
      }}
    >
      <div className="search-icon">
        <span>{Icons.SEARCH}</span>
      </div>
      <div className="search-content">
        <input
          className="rte-searchInput"
          type="text"
          placeholder="Search"
          onChange={e => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};
Search.defaultName = 'Search';
export default Search;
