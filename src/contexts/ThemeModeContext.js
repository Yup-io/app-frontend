import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material'
import { LOCAL_STORAGE_KEYS } from '../constants/enum'
import lightTheme from '../themes/light'
import darkTheme from '../themes/dark'

const ThemeModeContext = createContext({
  mode: null,
  toggleTheme: () => {},
  isLightMode: false,
  isDarkMode: true
});

const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(THEME_MODES.DARK);

  const toggleTheme = useCallback(() => {
    setMode((oldMode) => {
      const newMode = oldMode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;

      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME_MODE, newMode);

      return newMode;
    });
  }, []);

  useEffect(() => {
    const preservedMode = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME_MODE);
    const lightPreferred = window.matchMedia?.('(prefers-color-scheme: light)').matches;

    if (preservedMode) {
      setMode(preservedMode)
    } else if (lightPreferred) {
      setMode(THEME_MODES.LIGHT)
    }
  }, []);

  return (
    <ThemeModeContext.Provider
      value={{
        mode,
        toggleTheme,
        isLightMode: mode === THEME_MODES.LIGHT,
        isDarkMode: mode === THEME_MODES.DARK
      }}
    >
      <ThemeProvider theme={mode === THEME_MODES.LIGHT ? lightTheme : darkTheme}>
        <StyledEngineProvider injectFirst>
          <CssBaseline />
          {children}
        </StyledEngineProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
};

export const useThemeMode = () => useContext(ThemeModeContext);

export default ThemeModeContext;
