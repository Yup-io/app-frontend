import { createContext, useContext } from 'react';

const SideBarContext = createContext({
  open: false,
  closeSideBar: () => {}
});

export default SideBarContext;

export const useSideBar = () => useContext(SideBarContext);
