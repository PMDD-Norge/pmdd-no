/**
 * Reusable GROQ query fragments to reduce duplication
 * These fragments can be embedded in larger queries using string interpolation
 */

/**
 * Standard image projection with all common fields
 */
export const IMAGE_FRAGMENT = `{
  asset->,
  altText,
  hotspot,
  crop,
  title,
  description,
  credits,
  imageAlignment
}`;

/**
 * Simple image projection for thumbnails and small images
 */
export const IMAGE_SIMPLE_FRAGMENT = `{
  asset->,
  altText,
  hotspot
}`;

/**
 * Link projection with internal and external link support
 */
export const LINK_FRAGMENT = `{
  _key,
  _type,
  title,
  type,
  "internalLink": internalLink->{
    _type,
    title,
    slug{
      current
    }
  },
  url,
  email,
  phone,
  anchor,
  newTab
}`;

/**
 * SEO metadata projection
 */
export const SEO_FRAGMENT = `{
  title,
  description,
  image${IMAGE_SIMPLE_FRAGMENT},
  noIndex
}`;

/**
 * Base fields that all content types should have
 */
export const BASE_CONTENT_FRAGMENT = `{
  _id,
  _type,
  _key,
  _createdAt,
  _updatedAt
}`;

/**
 * Slug projection with translations
 */
export const SLUG_FRAGMENT = `{
  current,
  _type
}`;

/**
 * Rich text / Portable text projection
 */
export const RICH_TEXT_FRAGMENT = `[]`;

/**
 * Appearance projection for sections
 */
export const APPEARANCE_FRAGMENT = `{
  theme,
  linkType,
  layout{
    imagePosition
  },
  image${IMAGE_FRAGMENT}
}`;

/**
 * Call to action projection (commonly used across sections)
 */
export const CTA_FRAGMENT = `[]${LINK_FRAGMENT}`;
