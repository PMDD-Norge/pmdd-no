/**
 * GROQ queries for page documents
 */

// Get page by slug with all sections
export const PAGE_BY_SLUG_QUERY = `
*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  sections[]{
    _type,
    _key,
    theme,

    // Hero section
    _type == "hero" => {
      title,
      subtitle,
      body,
      image{asset->, altText, hotspot, title, description},
      callToActions[]{
        title,
        link{
          _type,
          title,
          type,
          type == "internal" => {
            "internalLink": internalLink->{
              _type,
              title,
              slug
            }
          },
          type == "external" => {url},
          type == "email" => {email},
          type == "phone" => {phone},
          anchor,
          newTab
        }
      },
      imagePosition
    },

    // Grid section (with new lists structure)
    _type == "grid" => {
      title,
      lists[]{
        _key,
        title,
        contentType,

        // Manual items
        contentType == "manual" => {
          items[]{
            _key,
            title,
            description,
            image{asset->, altText, hotspot},
            link{
              _type,
              title,
              type,
              type == "internal" => {
                "internalLink": internalLink->{
                  _type,
                  title,
                  slug
                }
              },
              type == "external" => {url},
              anchor,
              newTab
            }
          }
        },

        // Auto-populated writers
        contentType == "writer" => {
          "items": *[_type == "writer"] | order(name asc) {
            _id,
            name,
            role,
            image{asset->, altText, hotspot},
            slug,
            bio
          }
        },

        // Auto-populated events
        contentType == "event" => {
          "items": *[_type == "event"] | order(startDate desc) {
            _id,
            title,
            startDate,
            endDate,
            location,
            image{asset->, altText, hotspot},
            slug
          }
        },

        // Auto-populated blog posts
        contentType == "blog-post" => {
          "items": *[_type == "article" && type == "blog-post"] | order(publishedAt desc) [0...6] {
            _id,
            title,
            excerpt,
            image{asset->, altText, hotspot},
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
            image{asset->, altText, hotspot},
            slug,
            publishedAt
          }
        },

        // Auto-populated job positions
        contentType == "job-position" => {
          "items": *[_type == "article" && type == "job-position"] | order(publishedAt desc) [0...6] {
            _id,
            title,
            excerpt,
            image{asset->, altText, hotspot},
            slug,
            publishedAt
          }
        }
      }
    },

    // Callout section
    _type == "callout" => {
      title,
      body,
      callToActions[]{
        title,
        link{...}
      }
    },

    // Contact section
    _type == "contact" => {
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

    // Article section (embedded)
    _type == "article" => {
      title,
      body,
      image{asset->, altText, hotspot},
      imagePosition
    },

    // Features section
    _type == "features" => {
      title,
      features[]{
        _key,
        title,
        description,
        icon
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
        image{asset->, altText, hotspot}
      }
    },

    // Image section
    _type == "image" => {
      image{asset->, altText, hotspot, title, description},
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
      groups[]{
        _key,
        groupTitle,
        resources[]->{
          _id,
          title,
          description,
          resourceType,
          image,
          externalUrl,
          file
        }
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
  },
  seo{
    metaTitle,
    metaDescription,
    openGraphImage{asset->},
    noIndex
  }
}
`;

// Get all page slugs (for static generation)
export const PAGE_SLUGS_QUERY = `
*[_type == "page" && defined(slug.current)] {
  "slug": slug.current
}
`;

// Get landing page ID
export const LANDING_PAGE_ID_QUERY = `
*[_type == "page" && title == "Forside" || title == "Home"][0]._id
`;

// Get landing page with full data
export const LANDING_PAGE_QUERY = `
*[_type == "page" && (title == "Forside" || title == "Home")][0] {
  _id,
  title,
  slug,
  sections[]{
    _type,
    _key,
    theme,

    // All section types (same as PAGE_BY_SLUG_QUERY)
    _type == "hero" => {
      title,
      subtitle,
      body,
      image{asset->, altText, hotspot, title, description},
      callToActions[]{
        title,
        link{...}
      },
      imagePosition
    },

    _type == "grid" => {
      title,
      lists[]{
        _key,
        title,
        contentType,
        contentType == "manual" => {
          items[]{...}
        },
        contentType == "writer" => {
          "items": *[_type == "writer"] | order(name asc) {...}
        },
        contentType == "event" => {
          "items": *[_type == "event"] | order(startDate desc) {...}
        },
        contentType == "blog-post" => {
          "items": *[_type == "article" && type == "blog-post"] | order(publishedAt desc) [0...6] {...}
        }
      }
    },

    _type == "callout" => {...},
    _type == "contact" => {...},
    _type == "article" => {...},
    _type == "features" => {...},
    _type == "testimonials" => {...},
    _type == "image" => {...},
    _type == "quote" => {...},
    _type == "resources" => {...},
    _type == "logoSalad" => {...}
  },
  seo{
    metaTitle,
    metaDescription,
    openGraphImage{asset->},
    noIndex
  }
}
`;
