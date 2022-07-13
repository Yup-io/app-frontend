import { createContext, useContext } from 'react';

const SideBarContext = createContext({
  open: false
});

export default SideBarContext;

export const useSideBar = () => useContext(SideBarContext);
