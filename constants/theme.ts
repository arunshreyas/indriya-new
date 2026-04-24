/**
 * Indriya App Theme - Based on Sanatana Dharma spiritual design principles
 * Colors and typography inspired by traditional Indian aesthetics with modern minimalism
 */

import { Platform } from 'react-native';

// Primary brand colors - Saffron and spiritual tones
export const Colors = {
  // Core brand colors
  primary: '#f4c32f',
  primaryDark: '#d4a017',
  
  // Background colors
  backgroundLight: '#f8f8f5',
  backgroundDark: '#121212',
  surfaceDark: '#2d2715',
  neutralDark: '#231e10',
  
  // Text colors
  textLight: '#ffffff',
  textSecondary: '#ffffff',
  textMuted: '#ffffff50',
  textLightSecondary: '#ede7de',
  charcoal: '#211d11',
  
  // UI elements
  borderLight: '#ffffff10',
  borderDark: '#ffffff20',
  saffronMuted: '#685a31',
  
  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  
  // Legacy compatibility
  light: {
    text: '#11181C',
    background: '#f8f8f5',
    tint: '#f4c32f',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#f4c32f',
  },
  dark: {
    text: '#ffffff',
    background: '#121212',
    tint: '#f4c32f',
    icon: '#ffffff80',
    tabIconDefault: '#ffffff50',
    tabIconSelected: '#f4c32f',
  },
};

export const Typography = {
  // Font families
  display: ['Inter', 'sans-serif'],
  serif: ['Playfair Display', 'serif'],
  devanagari: ['Noto Serif Devanagari', 'serif'],
  newsreader: ['Newsreader', 'serif'],
  
  // Font sizes
  xs: '10px',
  sm: '12px',
  base: '14px',
  lg: '16px',
  xl: '18px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '28px',
  '5xl': '36px',
  '6xl': '42px',
  
  // Font weights
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  
  // Line heights
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
};

export const Spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  primary: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
};

// Legacy font compatibility
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'Inter',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'Playfair Display',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter',
    serif: 'Playfair Display',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
