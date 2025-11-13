/**
 * GROQ queries for event documents
 */

// Common event fields
const EVENT_FIELDS = `
  _id,
  _type,
  title,
  slug,
  startDate,
  endDate,
  location,
  image{
    asset->,
    altText,
    hotspot,
    title,
    description
  }
`;

// Get all events
export const ALL_EVENTS_QUERY = `
*[_type == "event" && !(_id in path("drafts.**"))] | order(startDate desc) {
  ${EVENT_FIELDS},
  registrationLink{
    title,
    type,
    type == "external" => {url},
    newTab
  }
}
`;

// Get event by slug
export const EVENT_BY_SLUG_QUERY = `
*[_type == "event" && slug.current == $slug][0] {
  ${EVENT_FIELDS},
  body,
  registrationLink{
    title,
    type,
    type == "external" => {url},
    type == "internal" => {
      "internalLink": internalLink->{
        _type,
        title,
        slug
      }
    },
    newTab
  }
}
`;

// Get upcoming events
export const UPCOMING_EVENTS_QUERY = `
*[_type == "event" && startDate >= now() && !(_id in path("drafts.**"))] | order(startDate asc) {
  ${EVENT_FIELDS}
}
`;

// Get event slugs (for static generation)
export const EVENT_SLUGS_QUERY = `
*[_type == "event" && defined(slug.current)] {
  "slug": slug.current
}
`;
