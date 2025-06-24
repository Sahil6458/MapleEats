import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme } from '../types';

// Default theme
const defaultTheme: Theme = {
  colors: {
    primary: '#F97316',
    secondary: '#0D9488',
    accent: '#F97316',
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      disabled: '#9CA3AF'
    }
  },
  borderRadius: '0.5rem',
  fontFamily: 'Inter, system-ui, sans-serif'
};

interface ThemeContextType {
  theme: Theme;
  updateTheme: (newTheme: Partial<Theme>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode; initialTheme?: Partial<Theme> }> = ({
  children,
  initialTheme = {}
}) => {
  const [theme, setTheme] = useState<Theme>({
    ...defaultTheme,
    ...initialTheme,
    colors: {
      ...defaultTheme.colors,
      ...(initialTheme.colors || {})
    }
  });

  const updateTheme = (newTheme: Partial<Theme>) => {
    setTheme(prevTheme => ({
      ...prevTheme,
      ...newTheme,
      colors: {
        ...prevTheme.colors,
        ...(newTheme.colors || {}),
        text: {
          ...prevTheme.colors.text,
          ...(newTheme.colors?.text || {})
        }
      }
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};