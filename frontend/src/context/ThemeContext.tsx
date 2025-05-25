import React, { createContext, useContext, useState } from 'react';
import { Theme, ThemeColors } from '../interfaces/Theme';

interface ThemeContextType extends Theme {
  toggleTheme: () => void;
}

const defaultColors: ThemeColors = {
  primary: '#1F1633',
  secondary: '#3e1f42',
  background: '#1F1633',
  text: '#ffffff',
  contrastA500: '#ffffff',
  contrastA600: '#ffffff',
  input: '#fff',
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  colors: defaultColors
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const darkColors: ThemeColors = {
    primary: '#2B2440',
    secondary: '#FF6B1A',
    background: '#1A1A1A',
    text: '#FFFFFF',
    contrastA500: '#ffffff',
    contrastA600: '#ffffff',
    input: '#232136',
  };

  const theme: ThemeContextType = {
    isDarkMode,
    toggleTheme: () => setIsDarkMode(prev => !prev),
    colors: isDarkMode ? darkColors : defaultColors
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);