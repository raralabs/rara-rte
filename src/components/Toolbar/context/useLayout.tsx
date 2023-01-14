import React, { useEffect, useState } from 'react';

export interface LayoutContextProps {
  state: {
    colorSelector: boolean;
    headingSelector: boolean;
    alignSelector: boolean;
    listSelector: boolean;
    search: boolean;
  };
  updateState: (key: string, value: string) => void;
  slug: {
    colorSelector: string;
    headingSelector: string;
    alignSelector: string;
    listSelector: string;
    search: string;
  };
}
const slug = {
  colorSelector: 'colorSelector',
  headingSelector: 'headingSelector',
  alignSelector: 'alignSelector',
  listSelector: 'listSelector',
  search: 'search',
};
const ToolbarContext = React.createContext<LayoutContextProps | null>(null);

function ContextProvider<T>(props: { children: React.ReactNode }) {
  const { children } = props;

  const [state, setState] = useState<any>({
    colorSelector: false,
    headingSelector: false,
    alignSelector: false,
    listSelector: false,
    search: false,
  });
  const updateState = (key: string, value: string) => {
    for (let x in state) {
      state[x] = false;
    }
    setState({ ...state, [key]: value });
  };

  const handleHideDropdown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setState({
        colorSelector: false,
        headingSelector: false,
        alignSelector: false,
        listSelector: false,
      });
    }
  };
  const colorSelectorPortalRef = document.getElementById('colorSelectorPortal');
  const headingSelectorRef = document.getElementById('headingSelectorPortal');
  const alignSelectorRef = document.getElementById('alignSelectorPortal');
  const listSelectorRef = document.getElementById('listSelectorPortal');

  const handleClickOutside = (event: any) => {
    if (
      !colorSelectorPortalRef?.contains(event.target) &&
      !headingSelectorRef?.contains(event.target) &&
      !alignSelectorRef?.contains(event.target) &&
      !listSelectorRef?.contains(event.target)
    ) {
      setState({
        colorSelector: false,
        headingSelector: false,
        alignSelector: false,
        listSelector: false,
      });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleHideDropdown, true);
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('keydown', handleHideDropdown, true);
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
  return (
    <ToolbarContext.Provider value={{ state, updateState, slug }} {...props}>
      <>{children}</>
    </ToolbarContext.Provider>
  );
}

const useToolbar = () => React.useContext(ToolbarContext);

export default ContextProvider;

export { useToolbar };
