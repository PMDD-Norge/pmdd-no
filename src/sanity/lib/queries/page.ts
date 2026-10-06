/**
 * GROQ queries for page documents - REFACTORED
 * Using reusable fragments to reduce duplication from 806 lines to ~300 lines
 */

import { SLUG_PROJEKSJON } from "./slugs";
import {
  IMAGE_FRAGMENT,
  IMAGE_SIMPLE_FRAGMENT,
  LINK_FRAGMENT,
  SEO_FRAGMENT,
  APPEARANCE_FRAGMENT,
} from './fragments';

/**
 * Individual section type projections - reused in both page sections and sectionGroup
 */
const SECTION_TYPE_PROJECTIONS = `
  // Hero section
  _type == "hero" => {
    title,
    subtitle,
    body,
    image${IMAGE_FRAGMENT},
    callToActions[]${LINK_FRAGMENT},
    imagePosition,
    infoMessage{
      tittel,
      tekst
    }
  },

  // Grid section (with dynamic content types)
  _type == "grid" => {
    "title": coalesce(title, optionalTitle),
    tittelNivaa,
    richText,
    appearance${APPEARANCE_FRAGMENT},
    lists[]{
      _key,
      "title": coalesce(title, optionalTitle),
      contentType,
      columns,
      kolonnerMobil,
      maxItems,
      ctaLink${LINK_FRAGMENT},
      bunnTekst,

      // Manual items
      contentType == "manual" => {
        items[]{
          _key,
          title,
          lead,
          richText,
          image${IMAGE_SIMPLE_FRAGMENT},
          link${LINK_FRAGMENT}
        }
      },

      // Auto-populated frivillige (alle, eller filtrert på rolle)
      contentType == "frivillig" => {
        "items": *[_type == "frivillig"] | order(orderRank) {
          _id,
          _type,
          name,
          occupation,
          city,
          bio,
          email,
          roller,
          image${IMAGE_SIMPLE_FRAGMENT}
        }
      },
      contentType == "frivillig-styret" => {
        "items": *[_type == "frivillig" && "styret" in roller] | order(orderRank) {
          _id,
          _type,
          name,
          occupation,
          city,
          bio,
          email,
          roller,
          image${IMAGE_SIMPLE_FRAGMENT}
        }
      },
      contentType == "frivillig-raadgiver" => {
        "items": *[_type == "frivillig" && "raadgiver" in roller] | order(orderRank) {
          _id,
          _type,
          name,
          occupation,
          city,
          bio,
          email,
          roller,
          image${IMAGE_SIMPLE_FRAGMENT}
        }
      },
      contentType == "frivillig-frivillig" => {
        "items": *[_type == "frivillig" && "frivillig" in roller] | order(orderRank) {
          _id,
          _type,
          name,
          occupation,
          city,
          bio,
          email,
          roller,
          image${IMAGE_SIMPLE_FRAGMENT}
        }
      },
      contentType == "frivillig-skribent" => {
        "items": *[_type == "frivillig" && "skribent" in roller] | order(orderRank) {
          _id,
          _type,
          name,
          occupation,
          city,
          bio,
          email,
          roller,
          image${IMAGE_SIMPLE_FRAGMENT}
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
        "items": *[_type == "informasjonsartikkel"] | order(coalesce(publishedAt, _createdAt) desc) [0...6] {
          _id,
          _type,
          "type": "blog-post",
          title,
          lead,
          excerpt,
          richText,
          image${IMAGE_SIMPLE_FRAGMENT},
          ${SLUG_PROJEKSJON},
          publishedAt,
          "author": author->{name, slug}
        }
      },

      // Auto-populated news
      contentType == "news" => {
        "items": *[_type == "article" && type == "news"] | order(coalesce(publishedAt, _createdAt) desc) [0...6] {
          _id,
          _type,
          type,
          title,
          lead,
          excerpt,
          richText,
          image${IMAGE_SIMPLE_FRAGMENT},
          slug,
          publishedAt
        }
      },

      // Auto-populated job positions
      contentType == "job-position" => {
        "items": *[_type == "article" && type == "job-position"] | order(coalesce(publishedAt, _createdAt) desc) [0...6] {
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
      },

      // Auto-populated walking tours
      // Combined activities: events + walking tours, sorted by date (upcoming only)
      contentType == "activities" => {
        "items": (
          *[
            _type == "event" &&
            !(_id in path("drafts.**")) &&
            coalesce(endDate, startDate) >= now()
          ] {
            _id, _type, title,
            "date": coalesce(startDate, _createdAt),
            startDate, endDate, location,
            richText, body,
            image${IMAGE_SIMPLE_FRAGMENT},
            slug, link${LINK_FRAGMENT}
          } +
          *[
            _type == "walkingTour" &&
            !(_id in path("drafts.**")) &&
            dateTime >= now()
          ] {
            _id, _type, title,
            "date": dateTime,
            dateTime, location, description,
            wheelchairFriendly, strollerFriendly, bringFood, facebookUrl,
            "turvenn": turvenn->{ name, city, image${IMAGE_SIMPLE_FRAGMENT} }
          }
        ) | order(date asc)
      },

      contentType == "walking-tour" => {
        "items": *[
          _type == "walkingTour" &&
          !(_id in path("drafts.**")) &&
          dateTime >= now()
        ] | order(dateTime asc) {
          _id,
          _type,
          title,
          dateTime,
          location,
          description,
          wheelchairFriendly,
          strollerFriendly,
          bringFood,
          facebookUrl,
          "turvenn": turvenn->{
            name,
            city,
            image${IMAGE_SIMPLE_FRAGMENT}
          }
        }
      },

      // Auto-populated turvenn
      contentType == "turvenn" => {
        "items": *[_type == "turvenn" && !(_id in path("drafts.**"))] | order(name asc) {
          _id,
          _type,
          name,
          city,
          image${IMAGE_SIMPLE_FRAGMENT}
        }
      },

      // Auto-populated aktivitet (erstatter event/activities/walking-tour)
      contentType == "aktivitet" => {
        "items": *[_type == "aktivitet" && !(_id in path("drafts.**"))] | order(coalesce(detaljer.dato, "9999-12-31") asc) {
          _id,
          _type,
          type,
          title,
          ingress,
          detaljer{dato, tid, sted, pris, lenke${LINK_FRAGMENT}}
        }
      },
      contentType == "aktivitet-gaatur" => {
        "items": *[_type == "aktivitet" && type == "gaatur" && !(_id in path("drafts.**"))] | order(coalesce(detaljer.dato, "9999-12-31") asc) {
          _id,
          _type,
          type,
          title,
          ingress,
          detaljer{dato, tid, sted, pris, lenke${LINK_FRAGMENT}}
        }
      },
      contentType == "aktivitet-kurs" => {
        "items": *[_type == "aktivitet" && type == "kurs" && !(_id in path("drafts.**"))] | order(coalesce(detaljer.dato, "9999-12-31") asc) {
          _id,
          _type,
          type,
          title,
          ingress,
          detaljer{dato, tid, sted, pris, lenke${LINK_FRAGMENT}}
        }
      },
      contentType == "aktivitet-event" => {
        "items": *[_type == "aktivitet" && type == "event" && !(_id in path("drafts.**"))] | order(coalesce(detaljer.dato, "9999-12-31") asc) {
          _id,
          _type,
          type,
          title,
          ingress,
          detaljer{dato, tid, sted, pris, lenke${LINK_FRAGMENT}}
        }
      },
      contentType == "aktivitet-fritekst" => {
        "items": *[_type == "aktivitet" && type == "fritekst" && !(_id in path("drafts.**"))] | order(coalesce(detaljer.dato, "9999-12-31") asc) {
          _id,
          _type,
          type,
          title,
          ingress,
          detaljer{dato, tid, sted, pris, lenke${LINK_FRAGMENT}}
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
    tittelNivaa,
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
`;

/**
 * Shared sections projection - used by both PAGE_BY_SLUG and LANDING_PAGE queries
 */
const SECTIONS_PROJECTION = `sections[]{
  _type,
  _key,
  theme,
  ${SECTION_TYPE_PROJECTIONS},

  // Section group (sections with no gap between them)
  _type == "sectionGroup" => {
    title,
    appearance{theme},
    sections[]{
      _type,
      _key,
      ${SECTION_TYPE_PROJECTIONS}
    }
  }
}`;

/**
 * Get landing page with full data
 * Now reuses SECTIONS_PROJECTION instead of duplicating 400 lines
 */
export const LANDING_PAGE_QUERY = `
*[_type == "hjem"][0] {
  _id,
  pageName,
  ${SECTIONS_PROJECTION},
  seo${SEO_FRAGMENT}
}
`;
