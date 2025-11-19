/**
 * GROQ queries for article documents (replaces post and availablePosition)
 * Article types: 'blog-post', 'news', 'job-position'
 */

// Common article fields fragment
const ARTICLE_FIELDS = `
  _id,
  _type,
  type,
  title,
  slug,
  excerpt,
  lead,
  publishedAt,
  featured,
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
  "author": author->{
    _id,
    name,
    slug,
    role,
    image
  }
`;

// Get article by slug
export const ARTICLE_BY_SLUG_QUERY = `
*[_type == "article" && slug.current == $slug][0] {
  ${ARTICLE_FIELDS},
  body,
  richText,
  tag,
  seo{
    metaTitle,
    metaDescription,
    openGraphImage{asset->},
    noIndex
  },
  "author": author->{
    name,
    slug,
    role,
    image,
    bio
  },
  "relatedArticles": *[
    _type == "article" &&
    slug.current != $slug &&
    count((categories[]->slug.current)[@ in ^.^.categories[]->slug.current]) > 0
  ] | order(publishedAt desc) [0...3] {
    title,
    slug,
    excerpt,
    image,
    publishedAt,
    type
  }
}
`;

// Get all articles of a specific type
export const ARTICLES_BY_TYPE_QUERY = `
*[_type == "article" && type == $type && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  ${ARTICLE_FIELDS}
}
`;

// Get featured articles
export const FEATURED_ARTICLES_QUERY = `
*[_type == "article" && featured == true && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  ${ARTICLE_FIELDS}
}
`;

// Get paginated articles with optional category filter
export const PAGINATED_ARTICLES_QUERY = `
*[
  _type == "article" &&
  type == $type &&
  !(_id in path("drafts.**")) &&
  (!defined($category) || $category in categories[]->slug.current)
] | order(publishedAt desc) [$start...$end] {
  ${ARTICLE_FIELDS}
}
`;

// Count articles (for pagination)
export const COUNT_ARTICLES_QUERY = `
count(*[
  _type == "article" &&
  type == $type &&
  !(_id in path("drafts.**")) &&
  (!defined($category) || $category in categories[]->slug.current)
])
`;

// Get article slugs (for static generation)
export const ARTICLE_SLUGS_QUERY = `
*[_type == "article" && defined(slug.current)] {
  "slug": slug.current,
  type
}
`;
