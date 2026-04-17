// ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { LightTheme, DarkTheme } from '../services/theme';

export const ThemeContext = createContext({
  theme: {
    ...LightTheme,
    fonts: LightTheme.fonts || {},
  },
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Initialize theme based on system preference
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(
    colorScheme === 'dark' ? DarkTheme : LightTheme
  );

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? DarkTheme : LightTheme);
    });
    return () => subscription.remove();
  }, []);

  // Manual toggle (for a switch in your UI)
  const toggleTheme = () => {
    setTheme((old) => (old.dark ? LightTheme : DarkTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
