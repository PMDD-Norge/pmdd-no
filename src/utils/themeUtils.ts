/**
 * Theme utility functions
 * Provides helpers for working with theme values and CSS classes
 */

import { Theme, ThemeClasses, AppearanceSettings } from '@/types/theme';
import { ColorTheme } from '@/sanity/lib/interfaces/appearance';

/**
 * Union type for all possible appearance objects
 */
type AppearanceWithTheme =
  | AppearanceSettings
  | { theme?: ColorTheme }
  | { theme?: Theme }
  | undefined;

/**
 * Converts a theme value to its corresponding CSS class name
 * @param theme - The theme value ('dark' or 'light')
 * @returns The CSS class name for the theme
 *
 * @example
 * getThemeClass('dark') // returns 'darkBackground'
 * getThemeClass('light') // returns 'lightBackground'
 */
export function getThemeClass(theme?: Theme): string {
  if (!theme) return ThemeClasses.light;
  return ThemeClasses[theme];
}

/**
 * Converts ColorTheme enum to Theme string
 */
function colorThemeToTheme(colorTheme?: ColorTheme): Theme | undefined {
  if (!colorTheme) return undefined;
  if (colorTheme === ColorTheme.Dark) return 'dark';
  if (colorTheme === ColorTheme.Light) return 'light';
  return undefined;
}

/**
 * Gets the theme class from appearance settings
 * @param appearance - Optional appearance settings object (supports both Appearance and AppearanceSettings)
 * @returns The CSS class name for the theme
 *
 * @example
 * getThemeClassFromAppearance({ theme: 'dark' }) // returns 'darkBackground'
 * getThemeClassFromAppearance(undefined) // returns 'lightBackground'
 */
export function getThemeClassFromAppearance(appearance?: AppearanceWithTheme): string {
  if (!appearance || !appearance.theme) return ThemeClasses.light;

  // Handle string theme ('dark' or 'light')
  if (typeof appearance.theme === 'string' && (appearance.theme === 'dark' || appearance.theme === 'light')) {
    return getThemeClass(appearance.theme as Theme);
  }

  // Handle ColorTheme enum values
  const theme = colorThemeToTheme(appearance.theme as ColorTheme);
  return getThemeClass(theme);
}

/**
 * Checks if a theme value is valid
 * @param value - The value to check
 * @returns True if the value is a valid theme
 */
export function isValidTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light';
}

/**
 * Gets the opposite theme
 * @param theme - The current theme
 * @returns The opposite theme
 *
 * @example
 * getOppositeTheme('dark') // returns 'light'
 * getOppositeTheme('light') // returns 'dark'
 */
export function getOppositeTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}
