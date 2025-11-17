/**
 * GROQ queries for navigation and footer
 */

// Get full navigation including footer
export const NAVIGATION_QUERY = `
*[_type == "navigationManager"][0] {
  _id,
  mainNavigation[]{
    _key,
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
  },
  ctaButton{
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
  footerSections[]{
    _key,
    sectionTitle,
    sectionType,
    sectionType == "content" => {
      linksAndContent[]{
        _type,
        _key,
        _type == "link" => {
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
        },
        _type == "richTextObject" => {
          richText
        }
      }
    },
    sectionType == "socialMedia" => {
      "socialMedia": *[_type == "socialMediaProfiles"][0]{
        profiles[]{
          _key,
          platform,
          url
        }
      }
    }
  }
}
`;

// Get landing page ID
export const LANDING_PAGE_ID_QUERY = `
*[_type == "page" && title == "Forside" || title == "Home"][0]._id
`;
