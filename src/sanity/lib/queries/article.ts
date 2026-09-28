/**
 * GROQ queries for article documents (replaces post and availablePosition)
 *
 * Two document types back these queries:
 *  - `informasjonsartikkel`: artikler på informasjonssiden (tidligere article med type "blog-post")
 *  - `article`: nyheter og ledige stillinger (type 'news', 'job-position')
 *
 * `$type` bruker fortsatt de gamle verdiene ('blog-post', 'news', 'job-position'),
 * slik at komponenter og lagret innhold kan bruke samme diskriminator som før.
 */

// Dokumenttypene som utgjør en artikkel, uansett variant
const ARTICLE_TYPES = `["article", "informasjonsartikkel"]`;

// Velger riktig dokumenttype ut fra $type
const ARTICLE_SOURCE = `(
  ($type == "blog-post" && _type == "informasjonsartikkel") ||
  ($type != "blog-post" && _type == "article" && type == $type)
)`;

// Common article fields fragment
const ARTICLE_FIELDS = `
  _id,
  _type,
  _createdAt,
  "type": coalesce(type, "blog-post"),
  title,
  slug,
  lead,
  publishedAt,
  "image": featuredImage{
    asset->,
    altText,
    hotspot,
    title,
    description
  },
  "categories": categories[]->{
    _id,
    name,
    slug
  },
  "author": skribent->{
    _id,
    name,
    slug,
    "role": occupation,
    image
  }
`;

// Get article by slug
export const ARTICLE_BY_SLUG_QUERY = `
*[_type in ${ARTICLE_TYPES} && slug.current == $slug]
| order(select(_type == "article" => 1, 0) asc)[0] {
  ${ARTICLE_FIELDS},
  richText,
  tag,
  seo{
    metaTitle,
    metaDescription,
    openGraphImage{asset->},
    noIndex
  },
  "relatedArticles": *[
    _type in ${ARTICLE_TYPES} &&
    slug.current != $slug &&
    count((categories[]->slug.current)[@ in ^.^.categories[]->slug.current]) > 0
  ] | order(coalesce(publishedAt, _createdAt) desc) [0...3] {
    title,
    slug,
    "image": featuredImage{asset->, altText, hotspot},
    publishedAt,
    "type": coalesce(type, "blog-post")
  }
}
`;

// Get all articles of a specific type
export const ARTICLES_BY_TYPE_QUERY = `
*[${ARTICLE_SOURCE} && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, _createdAt) desc) {
  ${ARTICLE_FIELDS}
}
`;

// Get featured articles
export const FEATURED_ARTICLES_QUERY = `
*[_type in ${ARTICLE_TYPES} && featured == true && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, _createdAt) desc) {
  ${ARTICLE_FIELDS}
}
`;

// Get paginated articles with optional category filter (by category _id)
export const PAGINATED_ARTICLES_QUERY = `
*[
  ${ARTICLE_SOURCE} &&
  !(_id in path("drafts.**")) &&
  (!defined($category) || $category in categories[]._ref)
] | order(coalesce(publishedAt, _createdAt) desc) [$start...$end] {
  ${ARTICLE_FIELDS}
}
`;

// Count articles (for pagination)
export const COUNT_ARTICLES_QUERY = `
count(*[
  ${ARTICLE_SOURCE} &&
  !(_id in path("drafts.**")) &&
  (!defined($category) || $category in categories[]._ref)
])
`;

// Get article slugs (for static generation)
export const ARTICLE_SLUGS_QUERY = `
*[_type in ${ARTICLE_TYPES} && defined(slug.current)] {
  "slug": slug.current,
  "type": coalesce(type, "blog-post")
}
`;
