/**
 * Utility functions for handling links and determining if they are external
 */

/**
 * Checks if a URL is external (not pointing to the current domain)
 * @param href - The URL to check
 * @returns true if the URL is external, false if internal
 */
export function isExternalLink(href: string): boolean {
  if (!href) return false;
  
  // Check for absolute URLs that start with http:// or https://
  if (href.startsWith('http://') || href.startsWith('https://')) {
    try {
      const url = new URL(href);
      const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
      
      // If we're on the server side, assume localhost or our domain patterns
      if (typeof window === 'undefined') {
        // Common local development patterns
        const localPatterns = ['localhost', '127.0.0.1', '0.0.0.0'];
        const isLocal = localPatterns.some(pattern => url.hostname.includes(pattern));
        
        // If it's a local URL during development, consider it internal
        // In production, you might want to check against your actual domain
        return !isLocal;
      }
      
      // Client-side check against current domain
      return url.hostname !== currentDomain;
    } catch {
      // If URL parsing fails, assume it's external for safety
      return true;
    }
  }
  
  // URLs starting with mailto:, tel:, etc. are considered "external" for icon purposes
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('sms:')) {
    return true;
  }
  
  // Relative URLs (starting with /, ./, ../) are internal
  if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
    return false;
  }
  
  // Fragment links (#section) are internal
  if (href.startsWith('#')) {
    return false;
  }
  
  // For any other case, assume internal
  return false;
}

/**
 * Checks if a link should open in a new tab
 * This is typically true for external links
 * @param href - The URL to check
 * @param blank - Explicit blank/newTab setting from CMS
 * @returns true if the link should open in a new tab
 */
export function shouldOpenInNewTab(href: string, blank?: boolean): boolean {
  // If explicitly set in CMS, use that
  if (typeof blank === 'boolean') {
    return blank;
  }
  
  // Default behavior: external links open in new tab
  return isExternalLink(href);
}