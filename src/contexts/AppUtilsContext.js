import { createContext, useContext, useEffect, useState } from 'react';

const AppUtilsContext = createContext({
  windowScrolled: false
});

export const AppUtilsProvider = ({ children }) => {
  const [windowScrolled, setWindowScrolled] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      setWindowScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', scrollListener);

    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  return (
    <AppUtilsContext.Provider
      value={{
        windowScrolled
      }}
    >

    </AppUtilsContext.Provider>
  );
};

export const useAppUtils = () => useContext(AppUtilsContext);

export default AppUtilsContext;
