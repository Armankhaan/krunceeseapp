// theme.js
import { Platform } from 'react-native';

export const LightTheme = {
  dark: false,
  colors: {
    primary: '#E11D48',      // Vibrant Rose Red
    background: '#F9FAFB',   // Soft Gray 50
    card: '#FFFFFF',         // Pure White
    text: '#1F2937',         // Slate 800
    border: '#E5E7EB',       // Gray 200
    notification: '#E11D48',
    secondary: '#FFB800',    // Amber/Gold
    muted: '#6B7280',        // Gray 500
    success: '#10B981',      // Emerald 500
    error: '#EF4444',        // Red 500
  },
  fonts: {
    bold: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    medium: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    regular: 'System',
  }
};

export const DarkTheme = {
  dark: true,
  colors: {
    primary: '#FB7185',      // Rose 400 (better contrast on dark)
    background: '#0F172A',   // Slate 900
    card: '#1E293B',         // Slate 800
    text: '#F8FAFC',         // Slate 50
    border: '#334155',       // Slate 700
    notification: '#FB7185',
    secondary: '#FBBF24',    // Amber 400
    muted: '#94A3B8',        // Slate 400
    success: '#34D399',      // Emerald 400
    error: '#F87171',        // Red 400
  },
  fonts: {
    bold: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    medium: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    regular: 'System',
  }
};
