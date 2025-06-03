/**
 * Tests for link utility functions
 */

import { isExternalLink, shouldOpenInNewTab } from '../linkUtils';

// Mock window.location for testing
const mockLocation = {
  hostname: 'example.com'
};

describe('isExternalLink', () => {
  beforeAll(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });
  });

  describe('External URLs', () => {
    it('should return true for external HTTP URLs', () => {
      expect(isExternalLink('http://google.com')).toBe(true);
      expect(isExternalLink('https://google.com')).toBe(true);
      expect(isExternalLink('https://www.external-site.com')).toBe(true);
    });

    it('should return true for mailto links', () => {
      expect(isExternalLink('mailto:test@example.com')).toBe(true);
    });

    it('should return true for tel links', () => {
      expect(isExternalLink('tel:+1234567890')).toBe(true);
    });

    it('should return true for sms links', () => {
      expect(isExternalLink('sms:+1234567890')).toBe(true);
    });
  });

  describe('Internal URLs', () => {
    it('should return false for same domain URLs', () => {
      expect(isExternalLink('https://example.com/page')).toBe(false);
      expect(isExternalLink('http://example.com/page')).toBe(false);
    });

    it('should return false for relative URLs', () => {
      expect(isExternalLink('/page')).toBe(false);
      expect(isExternalLink('/about-us')).toBe(false);
      expect(isExternalLink('./page')).toBe(false);
      expect(isExternalLink('../page')).toBe(false);
    });

    it('should return false for fragment links', () => {
      expect(isExternalLink('#section')).toBe(false);
      expect(isExternalLink('#top')).toBe(false);
    });

    it('should return false for empty or invalid URLs', () => {
      expect(isExternalLink('')).toBe(false);
      expect(isExternalLink('not-a-url')).toBe(false);
    });
  });

  describe('Local development URLs', () => {
    it('should handle localhost URLs appropriately', () => {
      // During development, localhost URLs should be considered internal
      expect(isExternalLink('http://localhost:3000/page')).toBe(false);
      expect(isExternalLink('https://127.0.0.1:3000/page')).toBe(false);
    });
  });
});

describe('shouldOpenInNewTab', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });
  });

  it('should respect explicit blank setting', () => {
    expect(shouldOpenInNewTab('/internal-page', true)).toBe(true);
    expect(shouldOpenInNewTab('/internal-page', false)).toBe(false);
    expect(shouldOpenInNewTab('https://external.com', true)).toBe(true);
    expect(shouldOpenInNewTab('https://external.com', false)).toBe(false);
  });

  it('should default to external link behavior when blank is undefined', () => {
    expect(shouldOpenInNewTab('https://external.com')).toBe(true);
    expect(shouldOpenInNewTab('/internal-page')).toBe(false);
    expect(shouldOpenInNewTab('mailto:test@example.com')).toBe(true);
  });
});