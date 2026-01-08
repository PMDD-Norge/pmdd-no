/**
 * Application-wide constants and configuration
 * Centralizes magic numbers and repeated values
 */

/**
 * Pagination constants
 */
export const PAGINATION = {
  /** Number of posts per page in article listings */
  POSTS_PER_PAGE: 12,
  /** Number of job positions to fetch */
  MAX_JOB_POSITIONS: 100,
  /** Number of featured articles to show */
  FEATURED_ARTICLES_LIMIT: 6,
} as const;

/**
 * ISR (Incremental Static Regeneration) revalidation times in seconds
 */
export const REVALIDATION = {
  /** Landing page: 12 hours */
  LANDING_PAGE: 43200,
  /** Regular pages: 24 hours */
  DEFAULT_PAGE: 86400,
  /** No cache during development */
  DEVELOPMENT: 0,
} as const;

/**
 * Default language for the application
 */
export const DEFAULT_LANGUAGE = "no" as const;

/**
 * Landing page identifiers
 * Used to identify the home/landing page in queries
 */
export const LANDING_PAGE_NAMES = ["Forside", "Home", "Hjem"] as const;

/**
 * Content type identifiers
 * Maps to Sanity document types
 */
export const CONTENT_TYPES = {
  PAGE: "page",
  ARTICLE: "article",
  EVENT: "event",
  COLLECTION_HUB: "collectionHub",
  AVAILABLE_POSITION: "availablePosition",
  LEGAL_DOCUMENT: "legalDocument",
  INFORMATION: "information",
  HIGHLIGHTS: "highlights",
} as const;

/**
 * Article type identifiers
 */
export const ARTICLE_TYPES = {
  BLOG_POST: "blog-post",
  NEWS: "news",
  JOB_POSITION: "job-position",
} as const;

/**
 * Section type identifiers
 */
export const SECTION_TYPES = {
  HERO: "hero",
  ARTICLE: "articleSection",
  CALLOUT: "callout",
  CTA: "ctaSection",
  CONTACT: "contactSection",
  FEATURES: "features",
  GRID: "grid",
  IMAGE: "image",
  LOGO_SALAD: "logoSalad",
  QUOTE: "quote",
  RESOURCES: "resources",
  TESTIMONIALS: "testimonials",
} as const;

/**
 * External URLs
 */
export const EXTERNAL_URLS = {
  SANITY_CDN: "https://cdn.sanity.io",
  GOOGLE_FONTS: "https://fonts.googleapis.com",
  GOOGLE_FONTS_STATIC: "https://fonts.gstatic.com",
} as const;

/**
 * Environment helpers
 */
export const ENV = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

/**
 * API Routes
 */
export const API_ROUTES = {
  REVALIDATE: "/api/revalidate",
  REVALIDATE_SANITY: "/api/revalidate-sanity",
  DRAFT_MODE_ENABLE: "/api/draft-mode/enable",
  DRAFT_MODE_DISABLE: "/api/draft-mode/disable",
} as const;

/**
 * Type exports for use in other files
 */
export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];
export type ArticleType = (typeof ARTICLE_TYPES)[keyof typeof ARTICLE_TYPES];
export type SectionType = (typeof SECTION_TYPES)[keyof typeof SECTION_TYPES];
