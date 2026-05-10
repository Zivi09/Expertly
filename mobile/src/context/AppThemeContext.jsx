import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors } from '../constants/theme';

const STORAGE_KEY = 'session-booking-theme-mode';

const AppThemeContext = createContext(null);

export function AppThemeProvider({ children }) {
  const [mode, setModeState] = useState('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && (stored === 'dark' || stored === 'light')) {
          setModeState(stored);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback(async (next) => {
    const m = next === 'dark' ? 'dark' : 'light';
    setModeState(m);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const isDark = mode === 'dark';
  const colors = useMemo(() => getColors(isDark), [isDark]);

  const value = useMemo(
    () => ({
      mode,
      isDark,
      colors,
      setMode,
      toggleMode,
      ready,
    }),
    [mode, isDark, colors, setMode, toggleMode, ready]
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return ctx;
}
