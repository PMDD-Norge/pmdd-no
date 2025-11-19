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
  "page": page->{
    ...
  },
  title,
  slug,
  description,
  richText,
  image{
    asset->,
    altText,
    hotspot,
    title,
    description
  },
  contactSection{
    _type,
    _key,
    title,
    description,
    richText,
    showCompanyInfo,
    showCompanyInfo == true => {
      "companyInfo": *[_type == "companyInformation"][0]{
        organizationName,
        address,
        email,
        phone
      }
    },
    additionalInfo,
    appearance
  },
  eventsSection{
    title,
    richText
  },
  availablePositionsSection{
    title,
    richText
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

// Get collection hub by type
export const COLLECTION_HUB_BY_TYPE_QUERY = `
*[_type == "collectionHub" && type == $type][0] {
  _id,
  type,
  page,
  title,
  description,
  image{
    asset->,
    altText,
    hotspot,
    title,
    description
  },
  contactSection{
    title,
    description,
    showCompanyInfo,
    showCompanyInfo == true => {
      "companyInfo": *[_type == "companyInformation"][0]{
        organizationName,
        address,
        email,
        phone
      }
    },
    additionalInfo
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

// Get collection hub with filtered articles
export const COLLECTION_HUB_WITH_ARTICLES_QUERY = `
*[_type == "collectionHub" && type == $type][0] {
  _id,
  type,
  page,
  title,
  description,
  image{asset->, altText, hotspot},
  allPostsLabel,
  contactSection,

  // Map collection type to article type
  type == "blog" => {
    "articles": *[_type == "article" && type == "blog-post" && !(_id in path("drafts.**"))] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      slug,
      excerpt,
      image{asset->, altText, hotspot},
      publishedAt,
      featured,
      "categories": categories[]->{name, slug},
      "author": author->{name, slug, image}
    },
    "totalCount": count(*[_type == "article" && type == "blog-post" && !(_id in path("drafts.**"))])
  },

  type == "news" => {
    "articles": *[_type == "article" && type == "news" && !(_id in path("drafts.**"))] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      slug,
      excerpt,
      image{asset->, altText, hotspot},
      publishedAt,
      featured,
      "categories": categories[]->{name, slug}
    },
    "totalCount": count(*[_type == "article" && type == "news" && !(_id in path("drafts.**"))])
  },

  type == "highlights" => {
    "events": *[_type == "event" && !(_id in path("drafts.**"))] | order(startDate desc) {
      _id,
      title,
      slug,
      startDate,
      endDate,
      location,
      image{asset->, altText, hotspot}
    },
    "positions": *[_type == "article" && type == "job-position" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      image{asset->, altText, hotspot},
      publishedAt
    }
  },

  seo
}
`;

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
