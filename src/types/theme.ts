/**
 * Shared theme and appearance types
 * Consolidates theme-related types used across the application
 */

/**
 * Theme values - aligned with Sanity schema
 */
export type Theme = 'dark' | 'light';

/**
 * Legacy enum for backwards compatibility
 * @deprecated Use Theme type instead
 */
export enum ColorTheme {
  Light = "light",
  Dark = "dark",
}

/**
 * Appearance settings for components
 */
export interface AppearanceSettings {
  theme?: Theme;
  linkType?: 'button' | 'link';
}

/**
 * Interface for components that support theming
 */
export interface ThemableComponent {
  appearance?: AppearanceSettings;
}

/**
 * CSS class names for themes
 */
export const ThemeClasses = {
  dark: 'darkBackground',
  light: 'lightBackground',
} as const;
