/**
 * Font configuration for the application
 * Centralizes Next.js font setup for better maintainability
 */

import { Nunito, Poller_One } from "next/font/google";

/**
 * Poller One - Display font for headings
 */
export const pollerOne = Poller_One({
  subsets: ["latin"],
  variable: "--font-pollerOne",
  weight: "400",
  display: "swap",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  preload: true,
});

/**
 * Nunito - Body font for text content
 */
export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "700"],
  display: "swap",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  preload: true,
});

/**
 * Combined font class names for applying to body element
 */
export const fontVariables = `${nunito.variable} ${pollerOne.variable}`;
