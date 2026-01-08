/**
 * GROQ queries for collectionHub documents (replaces highlights and information pages)
 * Collection types: 'blog', 'news', 'highlights', 'resources'
 */

// Get collection hub by slug (supports both new collectionHub and legacy information/highlights types)
export const COLLECTION_HUB_BY_SLUG_QUERY = `
*[(_type == "collectionHub" || _type == "information" || _type == "highlights") && slug.current == $slug][0] {
  _id,
  _type,
  type,
  title,
  slug,
  description,
  richText,
  body,
  image{
    asset->,
    altText,
    hotspot,
    title,
    description
  },

  // Dynamic content types array with auto-populated items
  contentTypes[]{
    _key,
    type,
    sectionTitle,
    description,
    maxItems,
    showFilters,
    layout,

    // Dynamically populate based on type
    type == "event" => {
      "items": *[_type == "event" && !(_id in path("drafts.**"))] | order(startDate desc) [0...20] {
        _id,
        _type,
        title,
        slug,
        startDate,
        endDate,
        location,
        richText,
        image{
          asset->,
          altText,
          hotspot
        }
      }
    },

    type == "blog-post" => {
      "items": *[_type == "article" && type == "blog-post" && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...20] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        image{
          asset->,
          altText,
          hotspot
        },
        publishedAt,
        "author": author->{
          name,
          slug,
          image{
            asset->,
            altText
          }
        },
        "categories": categories[]->{
          _id,
          name,
          slug
        }
      },
      ^.showFilters == true => {
        "categories": *[_type == "category" && count(*[_type == "article" && type == "blog-post" && references(^._id)]) > 0] | order(name asc) {
          _id,
          name,
          slug,
          "count": count(*[_type == "article" && type == "blog-post" && references(^._id)])
        }
      }
    },

    type == "news" => {
      "items": *[_type == "article" && type == "news" && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...20] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        image{
          asset->,
          altText,
          hotspot
        },
        publishedAt,
        "categories": categories[]->{
          _id,
          name,
          slug
        }
      },
      ^.showFilters == true => {
        "categories": *[_type == "category" && count(*[_type == "article" && type == "news" && references(^._id)]) > 0] | order(name asc) {
          _id,
          name,
          slug,
          "count": count(*[_type == "article" && type == "news" && references(^._id)])
        }
      }
    },

    type == "job-position" => {
      "items": *[_type == "article" && type == "job-position" && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...20] {
        _id,
        _type,
        title,
        slug,
        lead,
        tag,
        image{
          asset->,
          altText,
          hotspot
        },
        publishedAt
      }
    },

    type == "resource" => {
      "items": *[_type == "resource" && !(_id in path("drafts.**"))] | order(_createdAt desc) [0...20] {
        _id,
        _type,
        title,
        slug,
        description,
        url,
        resourceType,
        image{
          asset->,
          altText,
          hotspot
        }
      }
    }
  },

  contactSection{
    _type,
    _key,
    title,
    "richText": coalesce(body, richText),
    callToActions[]{
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
    },
    appearance{
      theme,
      linkType
    }
  },
  allPostsLabel,
  seo{
    metaTitle,
    metaDescription,
    openGraphImage{asset->},
    noIndex
  }
}
`;

// Get collection hub by type (simplified - mainly for lookups)
export const COLLECTION_HUB_BY_TYPE_QUERY = `
*[_type == "collectionHub" && type == $type][0] {
  _id,
  type,
  title,
  slug,
  description,
  image{
    asset->,
    altText,
    hotspot,
    title,
    description
  },
  allPostsLabel,
  seo{
    metaTitle,
    metaDescription,
    openGraphImage{asset->},
    noIndex
  }
}
`;

// Get collection hub with filtered articles (deprecated - now using contentTypes array)
// This is kept for potential backwards compatibility but new implementations should use COLLECTION_HUB_BY_SLUG_QUERY
export const COLLECTION_HUB_WITH_ARTICLES_QUERY = COLLECTION_HUB_BY_SLUG_QUERY;

// Get categories for a collection type
export const COLLECTION_CATEGORIES_QUERY = `
*[_type == "category" && count(*[_type == "article" && type == $articleType && references(^._id)]) > 0] | order(name asc) {
  _id,
  name,
  slug,
  description,
  "count": count(*[_type == "article" && type == $articleType && references(^._id)])
}
`;
