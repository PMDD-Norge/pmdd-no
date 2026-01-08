/**
 * GROQ queries for page documents - REFACTORED
 * Using reusable fragments to reduce duplication from 806 lines to ~300 lines
 */

import {
  IMAGE_FRAGMENT,
  IMAGE_SIMPLE_FRAGMENT,
  LINK_FRAGMENT,
  SEO_FRAGMENT,
  APPEARANCE_FRAGMENT,
} from './fragments';

/**
 * Shared sections projection - used by both PAGE_BY_SLUG and LANDING_PAGE queries
 * This eliminates ~400 lines of duplication
 */
const SECTIONS_PROJECTION = `sections[]{
  _type,
  _key,
  theme,

  // Hero section
  _type == "hero" => {
    title,
    subtitle,
    body,
    image${IMAGE_FRAGMENT},
    callToActions[]${LINK_FRAGMENT},
    imagePosition
  },

  // Grid section (with dynamic content types)
  _type == "grid" => {
    title,
    richText,
    appearance${APPEARANCE_FRAGMENT},
    lists[]{
      _key,
      title,
      contentType,
      maxItems,

      // Manual items
      contentType == "manual" => {
        items[]{
          _key,
          title,
          richText,
          image${IMAGE_SIMPLE_FRAGMENT},
          link${LINK_FRAGMENT}
        }
      },

      // Auto-populated writers
      contentType == "writer" => {
        "items": *[_type == "writer"] | order(name asc) {
          _id,
          name,
          role,
          image${IMAGE_SIMPLE_FRAGMENT},
          slug,
          bio
        }
      },

      // Auto-populated events
      contentType == "event" => {
        "items": *[_type == "event"] | order(startDate desc) {
          _id,
          _type,
          title,
          startDate,
          endDate,
          location,
          richText,
          body,
          image${IMAGE_SIMPLE_FRAGMENT},
          slug,
          link${LINK_FRAGMENT}
        }
      },

      // Auto-populated blog posts
      contentType == "blog-post" => {
        "items": *[_type == "article" && type == "blog-post"] | order(publishedAt desc) [0...6] {
          _id,
          title,
          excerpt,
          image${IMAGE_SIMPLE_FRAGMENT},
          slug,
          publishedAt,
          "author": author->{name, slug}
        }
      },

      // Auto-populated news
      contentType == "news" => {
        "items": *[_type == "article" && type == "news"] | order(publishedAt desc) [0...6] {
          _id,
          title,
          excerpt,
          image${IMAGE_SIMPLE_FRAGMENT},
          slug,
          publishedAt
        }
      },

      // Auto-populated job positions
      contentType == "job-position" => {
        "items": *[_type == "article" && type == "job-position"] | order(publishedAt desc) [0...6] {
          _id,
          _type,
          type,
          title,
          lead,
          richText,
          image${IMAGE_SIMPLE_FRAGMENT},
          slug,
          publishedAt,
          tag
        }
      },

      // Auto-populated posts
      contentType == "post" => {
        "items": *[_type == "post"] | order(date desc) {
          _id,
          _type,
          "title": coalesce(title[_key == "no"][0].value, title[0].value),
          "lead": coalesce(lead[_key == "no"][0].value, lead[0].value),
          "richText": coalesce(richText[_key == "no"][0].value, richText[0].value),
          image${IMAGE_SIMPLE_FRAGMENT},
          slug,
          date,
          categories[]->{_id, name}
        }
      },

      // Auto-populated available positions
      contentType == "availablePosition" => {
        "items": *[_type == "availablePosition"] | order(_createdAt desc) {
          _id,
          _type,
          title,
          lead,
          richText,
          tag,
          slug
        }
      }
    }
  },

  // Callout section
  _type == "callout" => {
    richText,
    appearance${APPEARANCE_FRAGMENT}
  },

  // Call To Action section
  _type == "ctaSection" => {
    title,
    richText,
    appearance{
      theme,
      layout{
        imagePosition
      },
      image${IMAGE_SIMPLE_FRAGMENT}
    },
    callToActions[]${LINK_FRAGMENT}
  },

  // Contact section
  _type == "contactSection" => {
    title,
    "richText": coalesce(body, richText),
    callToActions[]${LINK_FRAGMENT},
    appearance{
      theme,
      linkType
    }
  },

  // Article section (embedded)
  _type == "articleSection" => {
    tag,
    title,
    richText,
    callToActions[]${LINK_FRAGMENT},
    mediaType,
    image${IMAGE_FRAGMENT},
    iframeUrl,
    appearance${APPEARANCE_FRAGMENT}
  },

  // Features section
  _type == "features" => {
    title,
    richText,
    list[]{
      _key,
      title,
      richText,
      description,
      icon
    },
    link${LINK_FRAGMENT},
    appearance{
      theme,
      image${IMAGE_SIMPLE_FRAGMENT}
    }
  },

  // Testimonials section
  _type == "testimonials" => {
    title,
    testimonies[]{
      _key,
      name,
      company,
      quote,
      image${IMAGE_SIMPLE_FRAGMENT}
    }
  },

  // Image section
  _type == "image" => {
    image${IMAGE_FRAGMENT},
    caption
  },

  // Quote section
  _type == "quote" => {
    quote,
    author,
    role
  },

  // Resources section
  _type == "resources" => {
    title,
    richText,
    appearance{
      theme
    },
    groupedLinks[]{
      _key,
      _type,
      title,
      links[]${LINK_FRAGMENT}
    }
  },

  // Logo Salad section
  _type == "logoSalad" => {
    title,
    logos[]{
      _key,
      asset->,
      altText,
      hotspot
    }
  }
}`;

/**
 * Get page by slug with all sections
 */
export const PAGE_BY_SLUG_QUERY = `
*[_type == "page" && slug.current == $slug][0] {
  _id,
  pageName,
  slug,
  ${SECTIONS_PROJECTION},
  seo${SEO_FRAGMENT}
}
`;

/**
 * Get all page slugs (for static generation)
 */
export const PAGE_SLUGS_QUERY = `
*[_type == "page" && defined(slug.current)] {
  "slug": slug.current
}
`;

/**
 * Get landing page ID
 */
export const LANDING_PAGE_ID_QUERY = `
*[_type == "page" && (pageName == "Forside" || pageName == "Home" || pageName == "Hjem")][0]._id
`;

/**
 * Get landing page with full data
 * Now reuses SECTIONS_PROJECTION instead of duplicating 400 lines
 */
export const LANDING_PAGE_QUERY = `
*[_type == "page" && (pageName == "Forside" || pageName == "Home" || pageName == "Hjem")][0] {
  _id,
  pageName,
  slug,
  ${SECTIONS_PROJECTION},
  seo${SEO_FRAGMENT}
}
`;
