import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  THEME_IDS,
  DEFAULT_THEME,
  MODES,
  DEFAULT_MODE,
  THEME_STORAGE_KEY,
  MODE_STORAGE_KEY,
} from '@constants/themes';

const ThemeContext = createContext(undefined);

const readInitialTheme = () => {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_IDS.includes(stored) ? stored : DEFAULT_THEME;
};

const readInitialMode = () => {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
  if (MODES.includes(stored)) return stored;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readInitialTheme);
  const [mode, setModeState] = useState(readInitialMode);

  // Reflect state onto <html data-theme data-mode> and persist to
  // localStorage. The index.html inline script already set the initial
  // attributes before hydration to avoid a flash of unstyled theme.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);

  const setTheme = useCallback((next) => {
    if (THEME_IDS.includes(next)) setThemeState(next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setMode = useCallback((next) => {
    if (MODES.includes(next)) setModeState(next);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, mode, setMode, toggleMode, isDark: mode === 'dark' }),
    [theme, setTheme, mode, setMode, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
