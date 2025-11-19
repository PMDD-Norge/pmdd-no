/**
 * GROQ queries for page documents
 */

// Get page by slug with all sections
export const PAGE_BY_SLUG_QUERY = `
*[_type == "page" && slug.current == $slug][0] {
  _id,
  pageName,
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
        _key,
        title,
        type,
        "internalLink": internalLink->{
          _type,
          title,
          slug
        },
        url,
        email,
        phone,
        anchor,
        newTab
      },
      imagePosition
    },

    // Grid section (with new lists structure)
    _type == "grid" => {
      title,
      richText,
      appearance{
        theme,
        linkType,
        layout{
          imagePosition
        },
        image{
          asset->,
          altText,
          hotspot,
          crop,
          title,
          description,
          credits,
          imageAlignment
        }
      },
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
            image{asset->, altText, hotspot},
            link{
              _type,
              title,
              type,
              "internalLink": internalLink->{
                _type,
                title,
                slug
              },
              url,
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
            _type,
            title,
            startDate,
            endDate,
            location,
            richText,
            body,
            image{asset->, altText, hotspot},
            slug,
            link{
              _type,
              title,
              type,
              "internalLink": internalLink->{
                _type,
                title,
                slug
              },
              url,
              anchor,
              newTab
            }
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
            _type,
            type,
            title,
            lead,
            richText,
            image{asset->, altText, hotspot},
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
            image{asset->, altText, hotspot},
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
      appearance{
        theme,
        linkType,
        layout{
          imagePosition
        },
        image{
          asset->,
          altText,
          hotspot,
          crop,
          title,
          description,
          credits,
          imageAlignment
        }
      }
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
        image{asset->, altText, hotspot}
      },
      callToActions[]{
        _type,
        title,
        type,
        "internalLink": internalLink->{
          _type,
          title,
          slug
        },
        url,
        email,
        phone,
        anchor,
        newTab
      }
    },

    // Contact section
    _type == "contactSection" => {
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
    _type == "articleSection" => {
      tag,
      title,
      richText,
      callToActions[]{
        _type,
        title,
        type,
        "internalLink": internalLink->{
          _type,
          title,
          slug
        },
        url,
        email,
        phone,
        anchor,
        newTab
      },
      mediaType,
      image{
        asset->,
        altText,
        hotspot,
        crop,
        title,
        description,
        credits
      },
      iframeUrl,
      appearance{
        theme,
        linkType,
        layout{
          imagePosition
        },
        image{
          asset->,
          altText,
          hotspot,
          crop,
          title,
          description,
          credits,
          imageAlignment
        }
      }
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
      link{
        _type,
        title,
        type,
        "internalLink": internalLink->{
          _type,
          title,
          slug
        },
        url,
        anchor,
        newTab
      },
      appearance{
        theme,
        image{
          asset->,
          altText,
          hotspot
        }
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
      richText,
      appearance{
        theme
      },
      groupedLinks[]{
        _key,
        _type,
        title,
        links[]{
          _key,
          _type,
          title,
          description,
          type,
          url,
          newTab,
          "internalLink": internalLink->{
            _type,
            title,
            slug
          }
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
    title,
    description,
    image{asset->},
    keywords
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
*[_type == "page" && (pageName == "Forside" || pageName == "Home" || pageName == "Hjem")][0]._id
`;

// Get landing page with full data
export const LANDING_PAGE_QUERY = `
*[_type == "page" && (pageName == "Forside" || pageName == "Home" || pageName == "Hjem")][0] {
  _id,
  pageName,
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
        _key,
        title,
        type,
        "internalLink": internalLink->{
          _type,
          title,
          slug
        },
        url,
        email,
        phone,
        anchor,
        newTab
      },
      imagePosition
    },

    _type == "grid" => {
      title,
      richText,
      appearance{
        theme,
        linkType,
        layout{
          imagePosition
        },
        image{
          asset->,
          altText,
          hotspot,
          crop,
          title,
          description,
          credits,
          imageAlignment
        }
      },
      lists[]{
        _key,
        title,
        contentType,
        maxItems,
        contentType == "manual" => {
          items[]{
            _key,
            title,
            richText,
            image{asset->, altText, hotspot},
            link{
              _type,
              title,
              type,
              "internalLink": internalLink->{
                _type,
                title,
                slug
              },
              url,
              anchor,
              newTab
            }
          }
        },
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
            image{asset->, altText, hotspot},
            slug,
            link{
              _type,
              title,
              type,
              "internalLink": internalLink->{
                _type,
                title,
                slug
              },
              url,
              anchor,
              newTab
            }
          }
        },
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
        contentType == "job-position" => {
          "items": *[_type == "article" && type == "job-position"] | order(publishedAt desc) [0...6] {
            _id,
            _type,
            type,
            title,
            lead,
            richText,
            image{asset->, altText, hotspot},
            slug,
            publishedAt,
            tag
          }
        },
        contentType == "post" => {
          "items": *[_type == "post"] | order(date desc) {
            _id,
            _type,
            "title": coalesce(title[_key == "no"][0].value, title[0].value),
            "lead": coalesce(lead[_key == "no"][0].value, lead[0].value),
            "richText": coalesce(richText[_key == "no"][0].value, richText[0].value),
            image{asset->, altText, hotspot},
            slug,
            date,
            categories[]->{_id, name}
          }
        },
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

    _type == "callout" => {
      richText,
      appearance{
        theme,
        linkType,
        layout{
          imagePosition
        },
        image{
          asset->,
          altText,
          hotspot,
          crop,
          title,
          description,
          credits,
          imageAlignment
        }
      }
    },
    _type == "ctaSection" => {
      title,
      richText,
      appearance{
        theme,
        layout{
          imagePosition
        },
        image{asset->, altText, hotspot}
      },
      callToActions[]{
        _type,
        title,
        type,
        "internalLink": internalLink->{
          _type,
          title,
          slug
        },
        url,
        email,
        phone,
        anchor,
        newTab
      }
    },
    _type == "contactSection" => {...},
    _type == "articleSection" => {
      tag,
      title,
      richText,
      callToActions[]{
        _type,
        title,
        type,
        "internalLink": internalLink->{
          _type,
          title,
          slug
        },
        url,
        email,
        phone,
        anchor,
        newTab
      },
      mediaType,
      image{
        asset->,
        altText,
        hotspot,
        crop,
        title,
        description,
        credits
      },
      iframeUrl,
      appearance{
        theme,
        linkType,
        layout{
          imagePosition
        },
        image{
          asset->,
          altText,
          hotspot,
          crop,
          title,
          description,
          credits,
          imageAlignment
        }
      }
    },
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
      link{
        _type,
        title,
        type,
        "internalLink": internalLink->{
          _type,
          title,
          slug
        },
        url,
        anchor,
        newTab
      },
      appearance{
        theme,
        image{
          asset->,
          altText,
          hotspot
        }
      }
    },
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
    _type == "image" => {
      image{asset->, altText, hotspot, title, description},
      caption
    },
    _type == "quote" => {
      quote,
      author,
      role
    },
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
        links[]{
          _key,
          _type,
          title,
          description,
          type,
          url,
          newTab,
          "internalLink": internalLink->{
            _type,
            title,
            slug
          }
        }
      }
    },
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
    title,
    description,
    image{asset->},
    keywords
  }
}
`;
