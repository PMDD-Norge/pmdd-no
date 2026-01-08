import { clsx, type ClassValue } from "clsx";

/**
 * Utility function for conditionally joining classNames together.
 *
 * This combines clsx for conditional classes with support for
 * various input types (strings, objects, arrays, etc.)
 *
 * @example
 * cn("base-class", condition && "conditional-class", { "active": isActive })
 * // => "base-class conditional-class active"
 *
 * @param inputs - Class values to be combined
 * @returns Combined className string
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
